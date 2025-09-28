// FIX: This file was empty, causing a "not a module" error. Populated with the correct service implementation.
import { StreamEvent } from '../types';

async function* parseJsonStream<T>(readableStream: ReadableStream<Uint8Array>): AsyncGenerator<T> {
    const reader = readableStream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            if (buffer.length > 0) {
                // Handle any remaining data in the buffer
                try {
                    yield JSON.parse(buffer);
                } catch (e) {
                    console.error("Error parsing final chunk of stream:", e);
                }
            }
            break;
        }

        buffer += decoder.decode(value, { stream: true });
        
        // Process buffer line by line, assuming newline-delimited JSON
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep the last, possibly incomplete, line

        for (const line of lines) {
            if (line.trim() === '') continue;
            try {
                yield JSON.parse(line);
            } catch (e) {
                console.error("Error parsing stream chunk:", line, e);
            }
        }
    }
}


export async function* generateTaskStream(userQuery: string, isCancelled: () => boolean): AsyncGenerator<StreamEvent, void, unknown> {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userQuery }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            yield { type: 'error', message: `Server error: ${response.status} ${errorText}` };
            return;
        }
        
        if (!response.body) {
             yield { type: 'error', message: 'Response body is empty.' };
             return;
        }

        const stream = parseJsonStream<StreamEvent>(response.body);
        for await (const event of stream) {
            if (isCancelled()) {
                // In a real scenario, you might want to signal the server to abort.
                // For now, we just stop processing on the client.
                break;
            }
            yield event;
        }

    } catch (error) {
        console.error("Error fetching or parsing stream:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown network error occurred.';
        yield { type: 'error', message: `An error occurred: ${errorMessage}` };
    }
}
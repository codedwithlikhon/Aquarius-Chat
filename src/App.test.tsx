// FIX: Removed the triple-slash directive `/// <reference types="@testing-library/jest-dom" />`
// which was causing a "Cannot find type definition file" error.
// The types are correctly loaded via the import in `vitest.setup.ts`.
// FIX: screen, fireEvent, and waitFor are not always correctly exported from @testing-library/react. Importing from @testing-library/dom is a more robust solution.
import { render } from '@testing-library/react';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
// FIX: Import test globals from vitest to resolve type errors.
import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import App from './App';
import * as geminiService from './services/geminiService';
import { StreamEvent } from './types';

// Mock the geminiService
vi.mock('./services/geminiService');

describe('App component', () => {
  it('should render the initial state and allow a user to start a task', async () => {
    // A mock generator function to simulate the stream
    async function* mockStream(): AsyncGenerator<StreamEvent> {
      yield { type: 'status', message: 'Agent is thinking...' };
      yield { type: 'architecture', data: ['README.md', 'src/'] };
      yield {
        type: 'log',
        data: {
          title: 'Step 1',
          logs: [{ type: 'thought', content: 'Thinking about the task.' }],
        },
      };
      yield { type: 'status', message: 'Task completed', completed: true };
    }

    vi.mocked(geminiService.generateTaskStream).mockReturnValue(mockStream());

    render(<App />);

    // Initial state
    expect(screen.getByText('Aquarius AI Agent')).toBeInTheDocument();
    const input = screen.getByLabelText('Describe the task for the agent');
    expect(input).toBeEnabled();

    // User types a query and submits
    fireEvent.change(input, { target: { value: 'test query' } });
    const sendButton = input.nextElementSibling?.querySelector('button[type="submit"]');
    expect(sendButton).not.toBeNull();
    fireEvent.click(sendButton!);

    // Wait for the UI to update based on the stream
    await waitFor(() => {
      // Input should be disabled while running
      expect(input).toBeDisabled();
      // Status should update
      expect(screen.getByText('Working on your task')).toBeInTheDocument();
    });

    // Architecture should be displayed
    await waitFor(() => {
       expect(screen.getByText('README.md')).toBeInTheDocument();
    });
   
    // Log group should be displayed
    await waitFor(() => {
        expect(screen.getByText('Step 1')).toBeInTheDocument();
    });

    // Final state
    await waitFor(() => {
      expect(screen.getByText('Task finished')).toBeInTheDocument();
      // "New Task" button should appear
      expect(screen.getByText('New Task')).toBeInTheDocument();
      // Input is re-enabled
      expect(input).toBeEnabled();
    });
  });
});
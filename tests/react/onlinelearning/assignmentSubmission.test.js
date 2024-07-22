import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import AssignmentSubmissionComponent from './assignmentSubmission';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: assignment submitted successfully', async () => {
  fetchMock.post('/api/assignment', 200);

  await act(async () => { render(<MemoryRouter><AssignmentSubmissionComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('assignment-text'), { target: { value: 'assignment' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Assignment submitted successfully')).toBeInTheDocument();
}, 10000);

test('Failure: assignment submission fails', async () => {
  fetchMock.post('/api/assignment', 500);

  await act(async () => { render(<MemoryRouter><AssignmentSubmissionComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('assignment-text'), { target: { value: 'assignment' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Assignment submission failed')).toBeInTheDocument();
}, 10000);


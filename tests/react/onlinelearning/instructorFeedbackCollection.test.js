import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import InstructorFeedback from './instructorFeedbackCollection';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Feedback from instructors about course content is collected.', async () => {
  fetchMock.post('/api/instructors/feedback', { success: true });

  await act(async () => { render(<MemoryRouter><InstructorFeedback /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/content feedback/i), { target: { value: 'Well-structured course!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit feedback/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/feedback submitted/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when instructor feedback submission fails.', async () => {
  fetchMock.post('/api/instructors/feedback', 500);

  await act(async () => { render(<MemoryRouter><InstructorFeedback /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/content feedback/i), { target: { value: 'Could be better.' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit feedback/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to submit feedback/i)).toBeInTheDocument();
}, 10000);
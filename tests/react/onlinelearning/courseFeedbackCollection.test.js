import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CourseFeedback from './courseFeedbackCollection';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Feedback is collected at the end of the course.', async () => {
  fetchMock.post('/api/courses/feedback', { success: true });

  await act(async () => { render(<MemoryRouter><CourseFeedback /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/feedback/i), { target: { value: 'Excellent course!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit feedback/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/feedback submitted/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when feedback submission fails.', async () => {
  fetchMock.post('/api/courses/feedback', 500);

  await act(async () => { render(<MemoryRouter><CourseFeedback /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/feedback/i), { target: { value: 'Not great.' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit feedback/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to submit feedback/i)).toBeInTheDocument();
}, 10000);


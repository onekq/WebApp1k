import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './averageRatingCalculation_courseFeedbackCollection';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Average rating is calculated correctly for a course.', async () => {
  fetchMock.get('/api/courses/ratings', { average: 4.5 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  
  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/average rating/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when rating calculation fails.', async () => {
  fetchMock.get('/api/courses/ratings', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  
  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to calculate average rating/i)).toBeInTheDocument();
}, 10000);

test('Feedback is collected at the end of the course.', async () => {
  fetchMock.post('/api/courses/feedback', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/feedback/i), { target: { value: 'Excellent course!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit feedback/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/feedback submitted/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when feedback submission fails.', async () => {
  fetchMock.post('/api/courses/feedback', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/feedback/i), { target: { value: 'Not great.' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit feedback/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to submit feedback/i)).toBeInTheDocument();
}, 10000);
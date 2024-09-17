import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './courseRating_quizScoring';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Users can rate and review courses.', async () => {
  fetchMock.post('/api/courses/rate', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/rating/i), { target: { value: 5 } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/review/i), { target: { value: 'Great course!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit review/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/review submitted/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when submission fails.', async () => {
  fetchMock.post('/api/courses/rate', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/rating/i), { target: { value: 3 } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/review/i), { target: { value: 'Okay course.' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit review/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to submit review/i)).toBeInTheDocument();
}, 10000);

test('Quiz scoring is calculated correctly.', async () => {
  fetchMock.post('/api/quiz/score', { score: 85 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/answer/i), { target: { value: 'correct answer' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/your score/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when quiz scoring fails.', async () => {
  fetchMock.post('/api/quiz/score', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/answer/i), { target: { value: 'wrong answer' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/error/i)).toBeInTheDocument();
}, 10000);
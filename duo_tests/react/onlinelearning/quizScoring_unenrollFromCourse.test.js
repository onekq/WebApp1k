import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './quizScoring_unenrollFromCourse';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('Users can successfully unenroll from a course.', async () => {
  fetchMock.delete('/api/unenroll/101', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Unenroll from Course/i)); });

  expect(fetchMock.calls('/api/unenroll/101').length).toEqual(1);
  expect(screen.getByText(/Unenrolled successfully/i)).toBeInTheDocument();
}, 10000);

test('Users cannot unenroll from a course if the server returns an error.', async () => {
  fetchMock.delete('/api/unenroll/101', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Unenroll from Course/i)); });

  expect(fetchMock.calls('/api/unenroll/101').length).toEqual(1);
  expect(screen.getByText(/Failed to unenroll/i)).toBeInTheDocument();
}, 10000);
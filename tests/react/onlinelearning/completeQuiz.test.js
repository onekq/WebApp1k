import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CompleteQuizComponent from './completeQuiz';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: quiz completes and submits', async () => {
  fetchMock.post('/api/quiz', 200);

  await act(async () => { render(<MemoryRouter><CompleteQuizComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('quiz-answer'), { target: { value: 'answer' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Quiz submitted successfully')).toBeInTheDocument();
}, 10000);

test('Failure: quiz submission fails', async () => {
  fetchMock.post('/api/quiz', 500);

  await act(async () => { render(<MemoryRouter><CompleteQuizComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('quiz-answer'), { target: { value: 'answer' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Quiz submission failed')).toBeInTheDocument();
}, 10000);


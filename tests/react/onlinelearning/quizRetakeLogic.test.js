import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import QuizRetakeLogicComponent from './quizRetakeLogic';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: quiz retake works properly', async () => {
  fetchMock.post('/api/quiz-retake', 200);

  await act(async () => { render(<MemoryRouter><QuizRetakeLogicComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('retake-quiz-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Quiz retake successful')).toBeInTheDocument();
}, 10000);

test('Failure: quiz retake fails', async () => {
  fetchMock.post('/api/quiz-retake', 500);

  await act(async () => { render(<MemoryRouter><QuizRetakeLogicComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('retake-quiz-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Quiz retake failed')).toBeInTheDocument();
}, 10000);


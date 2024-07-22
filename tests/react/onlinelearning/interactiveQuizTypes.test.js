import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import InteractiveQuizTypesComponent from './interactiveQuizTypes';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: multiple choice quiz functions correctly', async () => {
  fetchMock.get('/api/multiple-choice-quiz', 200);

  await act(async () => { render(<MemoryRouter><InteractiveQuizTypesComponent /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('start-multiple-choice-quiz')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Multiple choice quiz loaded')).toBeInTheDocument();
}, 10000);

test('Failure: multiple choice quiz fails to load', async () => {
  fetchMock.get('/api/multiple-choice-quiz', 500);

  await act(async () => { render(<MemoryRouter><InteractiveQuizTypesComponent /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('start-multiple-choice-quiz')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error loading multiple choice quiz')).toBeInTheDocument();
}, 10000);


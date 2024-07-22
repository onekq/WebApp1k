import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './trackProgressInChallenges';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('System tracks progress in fitness challenges successfully.', async () => {
  fetchMock.get('/api/progress-challenges', { progress: '50%' });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-challenges')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/50%/)).toBeInTheDocument();
}, 10000);

test('System fails to track progress in fitness challenges.', async () => {
  fetchMock.get('/api/progress-challenges', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-challenges')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching challenges progress/)).toBeInTheDocument();
}, 10000);


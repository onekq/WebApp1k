import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './logWaterIntake_trackProgressInChallenges';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('logs water intake successfully and displays intake in the list', async () => {
  fetchMock.post('/api/log-water-intake', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter water intake'), { target: { value: '500' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Water')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Water logged successfully!')).toBeInTheDocument();
}, 10000);

test('fails to log water intake and displays an error message', async () => {
  fetchMock.post('/api/log-water-intake', { status: 400, body: { error: 'Invalid intake' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter water intake'), { target: { value: '-100' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Water')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log water intake.')).toBeInTheDocument();
}, 10000);

test('System tracks progress in fitness challenges successfully.', async () => {
  fetchMock.get('/api/progress-challenges', { progress: '50%' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-challenges')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/50%/)).toBeInTheDocument();
}, 10000);

test('System fails to track progress in fitness challenges.', async () => {
  fetchMock.get('/api/progress-challenges', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-challenges')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching challenges progress/)).toBeInTheDocument();
}, 10000);
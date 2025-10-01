import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './logSleepHours_summarizeStrengthTrainingProgress_weeklyAverageSleep';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('logs sleep hours successfully and displays hours in the list', async () => {
  fetchMock.post('/api/log-sleep', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter sleep hours'), { target: { value: '8' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Sleep')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sleep hours logged successfully!')).toBeInTheDocument();
}, 10000);

test('fails to log sleep hours and displays an error message', async () => {
  fetchMock.post('/api/log-sleep', { status: 400, body: { error: 'Invalid hours' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter sleep hours'), { target: { value: '-5' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Sleep')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log sleep hours.')).toBeInTheDocument();
}, 10000);

test('should summarize strength training progress successfully.', async () => {
  fetchMock.get('/api/strength/progress', { status: 200, body: { progress: 'increased' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('summarize-progress-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/strength/progress')).toBe(true);
  expect(screen.getByText('Progress: increased')).toBeInTheDocument();
}, 10000);

test('should fail to summarize strength training progress.', async () => {
  fetchMock.get('/api/strength/progress', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('summarize-progress-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/strength/progress')).toBe(true);
  expect(screen.getByText('Failed to fetch progress.')).toBeInTheDocument();
}, 10000);

test('System calculates weekly average sleep hours successfully.', async () => {
  fetchMock.get('/api/average-sleep', { hours: 7 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-sleep')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/7 hours/)).toBeInTheDocument();
}, 10000);

test('System fails to calculate weekly average sleep hours.', async () => {
  fetchMock.get('/api/average-sleep', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-sleep')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching sleep hours/)).toBeInTheDocument();
}, 10000);

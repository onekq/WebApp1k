import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './logYogaSession_summarizeStrengthTrainingProgress_totalYogaDuration';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('User can log a yoga session successfully.', async () => {
  fetchMock.post('/api/logYogaSession', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('yoga-session-type'), { target: { value: 'Ashtanga' } });
    fireEvent.click(screen.getByTestId('submit-yoga-session'));
  });

  expect(fetchMock.called('/api/logYogaSession')).toBeTruthy();
  expect(screen.getByText('Yoga session logged successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when logging a yoga session fails.', async () => {
  fetchMock.post('/api/logYogaSession', { status: 500, body: { error: 'Failed to log session' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('yoga-session-type'), { target: { value: 'Ashtanga' } });
    fireEvent.click(screen.getByTestId('submit-yoga-session'));
  });

  expect(fetchMock.called('/api/logYogaSession')).toBeTruthy();
  expect(screen.getByText('Failed to log session')).toBeInTheDocument();
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

test('should calculate total yoga duration successfully.', async () => {
  fetchMock.get('/api/yoga/duration', { status: 200, body: { totalDuration: '10 hours' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-duration-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/yoga/duration')).toBe(true);
  expect(screen.getByText('Total Duration: 10 hours')).toBeInTheDocument();
}, 10000);

test('should fail to calculate total yoga duration.', async () => {
  fetchMock.get('/api/yoga/duration', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-duration-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/yoga/duration')).toBe(true);
  expect(screen.getByText('Failed to calculate total duration.')).toBeInTheDocument();
}, 10000);

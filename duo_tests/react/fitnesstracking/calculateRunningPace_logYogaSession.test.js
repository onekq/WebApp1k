import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateRunningPace_logYogaSession';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should calculate running pace successfully.', async () => {
  fetchMock.post('/api/pace/calculate', { status: 200, body: { pace: '5:00 min/km' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('time-input'), { target: { value: '25' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('distance-input'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-pace-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/pace/calculate')).toBe(true);
  expect(screen.getByText('Pace: 5:00 min/km')).toBeInTheDocument();
}, 10000);

test('should fail to calculate running pace.', async () => {
  fetchMock.post('/api/pace/calculate', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('time-input'), { target: { value: '25' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('distance-input'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-pace-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/pace/calculate')).toBe(true);
  expect(screen.getByText('Failed to calculate pace.')).toBeInTheDocument();
}, 10000);

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
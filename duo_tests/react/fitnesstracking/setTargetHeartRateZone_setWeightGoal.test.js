import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './setTargetHeartRateZone_setWeightGoal';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should successfully set a target heart rate zone', async () => {
  fetchMock.post('/api/goals/heart-rate', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/heart rate zone/i), { target: { value: '120-150' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set zone/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/zone set successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when setting a target heart rate zone fails', async () => {
  fetchMock.post('/api/goals/heart-rate', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/heart rate zone/i), { target: { value: '120-150' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set zone/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to set zone/i)).toBeInTheDocument();
}, 10000);

test('should successfully set a weight goal', async () => {
  fetchMock.post('/api/goals/weight', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/weight goal/i), { target: { value: 150 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/goal set successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when setting a weight goal fails', async () => {
  fetchMock.post('/api/goals/weight', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/weight goal/i), { target: { value: 150 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to set goal/i)).toBeInTheDocument();
}, 10000);
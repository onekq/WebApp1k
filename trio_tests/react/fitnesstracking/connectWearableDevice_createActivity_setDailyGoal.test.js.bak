import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './connectWearableDevice_createActivity_setDailyGoal';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should connect to a wearable device successfully.', async () => {
  fetchMock.post('/api/device/connect', { status: 200 });
  
  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('device-input'), { target: { value: 'device-name' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('connect-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/device/connect')).toBe(true);
  expect(screen.getByText('Device connected successfully!')).toBeInTheDocument();
}, 10000);

test('should fail to connect to a wearable device.', async () => {
  fetchMock.post('/api/device/connect', 500);
  
  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('device-input'), { target: { value: 'device-name' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('connect-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/device/connect')).toBe(true);
  expect(screen.getByText('Failed to connect device.')).toBeInTheDocument();
}, 10000);

test('User can create a new fitness activity successfully.', async () => {
  fetchMock.post('/api/createActivity', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><FitnessApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-name'), { target: { value: 'Running' } });
    fireEvent.click(screen.getByTestId('submit-activity'));
  });

  expect(fetchMock.called('/api/createActivity')).toBeTruthy();
  expect(screen.getByText('Activity created successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when creating a new fitness activity fails.', async () => {
  fetchMock.post('/api/createActivity', { status: 500, body: { error: 'Failed to create activity' } });

  await act(async () => {
    render(<MemoryRouter><FitnessApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-name'), { target: { value: 'Running' } });
    fireEvent.click(screen.getByTestId('submit-activity'));
  });

  expect(fetchMock.called('/api/createActivity')).toBeTruthy();
  expect(screen.getByText('Failed to create activity')).toBeInTheDocument();
}, 10000);

test('should successfully set a daily fitness goal', async () => {
  fetchMock.post('/api/goals/daily', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><SetDailyGoal /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/daily goal/i), { target: { value: 10000 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/goal set successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when setting a daily fitness goal fails', async () => {
  fetchMock.post('/api/goals/daily', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><SetDailyGoal /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/daily goal/i), { target: { value: 10000 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to set goal/i)).toBeInTheDocument();
}, 10000);

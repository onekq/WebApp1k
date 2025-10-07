import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './setCalorieIntakeGoal_syncDataFromWearable_logWeight_totalDistanceCovered';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should successfully set a calorie intake goal (from setCalorieIntakeGoal_syncDataFromWearable)', async () => {
  fetchMock.post('/api/goals/calories', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/calorie goal/i), { target: { value: 2000 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/goal set successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when setting a calorie intake goal fails (from setCalorieIntakeGoal_syncDataFromWearable)', async () => {
  fetchMock.post('/api/goals/calories', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/calorie goal/i), { target: { value: 2000 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to set goal/i)).toBeInTheDocument();
}, 10000);

test('should sync data from connected wearable device successfully. (from setCalorieIntakeGoal_syncDataFromWearable)', async () => {
  fetchMock.get('/api/device/sync', { status: 200, body: { data: 'some-data' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sync-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/device/sync')).toBe(true);
  expect(screen.getByText('Data synced successfully!')).toBeInTheDocument();
}, 10000);

test('should fail to sync data from connected wearable device. (from setCalorieIntakeGoal_syncDataFromWearable)', async () => {
  fetchMock.get('/api/device/sync', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sync-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/device/sync')).toBe(true);
  expect(screen.getByText('Sync failed.')).toBeInTheDocument();
}, 10000);

test('logs weight successfully and displays weight in the list (from logWeight_totalDistanceCovered)', async () => {
  fetchMock.post('/api/log-weight', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter weight'), { target: { value: '70' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Weight')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Weight logged successfully!')).toBeInTheDocument();
}, 10000);

test('fails to log weight and displays an error message (from logWeight_totalDistanceCovered)', async () => {
  fetchMock.post('/api/log-weight', { status: 400, body: { error: 'Invalid weight' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter weight'), { target: { value: '-1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Weight')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log weight.')).toBeInTheDocument();
}, 10000);

test('System calculates total distance covered in a week successfully. (from logWeight_totalDistanceCovered)', async () => {
  fetchMock.get('/api/total-distance', { distance: 50 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-distance')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/50 miles/)).toBeInTheDocument();
}, 10000);

test('System fails to calculate total distance covered in a week. (from logWeight_totalDistanceCovered)', async () => {
  fetchMock.get('/api/total-distance', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-distance')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching distance/)).toBeInTheDocument();
}, 10000);


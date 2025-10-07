import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './logWeight_totalDistanceCovered_createActivity_trackWorkoutIntensity';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('User can create a new fitness activity successfully. (from createActivity_trackWorkoutIntensity)', async () => {
  fetchMock.post('/api/createActivity', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-name'), { target: { value: 'Running' } });
    fireEvent.click(screen.getByTestId('submit-activity'));
  });

  expect(fetchMock.called('/api/createActivity')).toBeTruthy();
  expect(screen.getByText('Activity created successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when creating a new fitness activity fails. (from createActivity_trackWorkoutIntensity)', async () => {
  fetchMock.post('/api/createActivity', { status: 500, body: { error: 'Failed to create activity' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-name'), { target: { value: 'Running' } });
    fireEvent.click(screen.getByTestId('submit-activity'));
  });

  expect(fetchMock.called('/api/createActivity')).toBeTruthy();
  expect(screen.getByText('Failed to create activity')).toBeInTheDocument();
}, 10000);

test('tracks workout intensity successfully and displays intensity (from createActivity_trackWorkoutIntensity)', async () => {
  fetchMock.get('/api/track-intensity', { status: 200, body: { intensity: 'Moderate' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Workout intensity: Moderate')).toBeInTheDocument();
}, 10000);

test('fails to track workout intensity and displays an error message (from createActivity_trackWorkoutIntensity)', async () => {
  fetchMock.get('/api/track-intensity', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to track workout intensity.')).toBeInTheDocument();
}, 10000);


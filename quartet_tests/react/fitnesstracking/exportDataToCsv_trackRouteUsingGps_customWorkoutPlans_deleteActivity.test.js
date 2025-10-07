import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './exportDataToCsv_trackRouteUsingGps_customWorkoutPlans_deleteActivity';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should export fitness data to CSV successfully. (from exportDataToCsv_trackRouteUsingGps)', async () => {
  fetchMock.get('/api/data/export', { status: 200, body: 'csv-data' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('export-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/data/export')).toBe(true);
  expect(screen.getByText('Data exported successfully!')).toBeInTheDocument();
}, 10000);

test('should fail to export fitness data to CSV. (from exportDataToCsv_trackRouteUsingGps)', async () => {
  fetchMock.get('/api/data/export', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('export-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/data/export')).toBe(true);
  expect(screen.getByText('Export failed.')).toBeInTheDocument();
}, 10000);

test('should track route using GPS successfully. (from exportDataToCsv_trackRouteUsingGps)', async () => {
  fetchMock.post('/api/gps/track', { status: 200, body: { route: 'sample-route-data' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('track-route-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/gps/track')).toBe(true);
  expect(screen.getByText('Route tracked successfully!')).toBeInTheDocument();
}, 10000);

test('should fail to track route using GPS. (from exportDataToCsv_trackRouteUsingGps)', async () => {
  fetchMock.post('/api/gps/track', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('track-route-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/gps/track')).toBe(true);
  expect(screen.getByText('Failed to track route.')).toBeInTheDocument();
}, 10000);

test('should successfully create a custom workout plan (from customWorkoutPlans_deleteActivity)', async () => {
  fetchMock.post('/api/workouts/custom', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/workout name/i), { target: { value: 'Morning Yoga' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/create plan/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/plan created successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when creating a custom workout plan fails (from customWorkoutPlans_deleteActivity)', async () => {
  fetchMock.post('/api/workouts/custom', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/workout name/i), { target: { value: 'Morning Yoga' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/create plan/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to create plan/i)).toBeInTheDocument();
}, 10000);

test('User can delete a fitness activity successfully. (from customWorkoutPlans_deleteActivity)', async () => {
  fetchMock.delete('/api/deleteActivity', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-activity'));
  });

  expect(fetchMock.called('/api/deleteActivity')).toBeTruthy();
  expect(screen.getByText('Activity deleted successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when deleting a fitness activity fails. (from customWorkoutPlans_deleteActivity)', async () => {
  fetchMock.delete('/api/deleteActivity', { status: 500, body: { error: 'Failed to delete activity' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-activity'));
  });

  expect(fetchMock.called('/api/deleteActivity')).toBeTruthy();
  expect(screen.getByText('Failed to delete activity')).toBeInTheDocument();
}, 10000);


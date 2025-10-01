import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteTrainingSessionLog_filterActivitiesByType_trackHealthMetrics';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Deletes a training session log successfully.', async () => {
  fetchMock.delete('/training-sessions/1', { message: 'Training session deleted' });

  await act(async () => { render(<MemoryRouter><DeleteTrainingSessionLog trainingId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/training-sessions/1').length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Fails to delete training session log with error message.', async () => {
  fetchMock.delete('/training-sessions/1', { status: 500, body: { message: 'Failed to delete training session' } });

  await act(async () => { render(<MemoryRouter><DeleteTrainingSessionLog trainingId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/training-sessions/1').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Filters activities by type successfully.', async () => {
  fetchMock.get('/activities?type=walk', [{ type: 'walk', description: 'Morning walk' }]);

  await act(async () => { render(<MemoryRouter><FilterActivitiesByType /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('filter-input'), { target: { value: 'walk' } }); });

  expect(fetchMock.calls('/activities?type=walk').length).toBe(1);
  expect(screen.getByText('Morning walk')).toBeInTheDocument();
}, 10000);

test('Fails to filter activities by type with error message.', async () => {
  fetchMock.get('/activities?type=walk', { status: 500, body: { message: 'Failed to filter activities' } });

  await act(async () => { render(<MemoryRouter><FilterActivitiesByType /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('filter-input'), { target: { value: 'walk' } }); });

  expect(fetchMock.calls('/activities?type=walk').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Track health metrics successfully', async () => {
  fetchMock.post('/api/health-metrics', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('weight-input'), { target: { value: '10.2' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-metrics').length).toBe(1);
  expect(screen.getByText('Health metrics recorded successfully')).toBeInTheDocument();
}, 10000);

test('Fail to track health metrics with error', async () => {
  fetchMock.post('/api/health-metrics', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('weight-input'), { target: { value: '' } }); }); // Failure case: Empty input
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-metrics').length).toBe(1);
  expect(screen.getByText('Failed to record health metrics')).toBeInTheDocument(); // Error message
}, 10000);

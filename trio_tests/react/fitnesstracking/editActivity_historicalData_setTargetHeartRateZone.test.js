import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editActivity_historicalData_setTargetHeartRateZone';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('User can edit an existing fitness activity successfully.', async () => {
  fetchMock.put('/api/editActivity', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-name'), { target: { value: 'Updated Running' } });
    fireEvent.click(screen.getByTestId('submit-edit'));
  });

  expect(fetchMock.called('/api/editActivity')).toBeTruthy();
  expect(screen.getByText('Activity updated successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when editing a fitness activity fails.', async () => {
  fetchMock.put('/api/editActivity', { status: 500, body: { error: 'Failed to edit activity' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-name'), { target: { value: 'Updated Running' } });
    fireEvent.click(screen.getByTestId('submit-edit'));
  });

  expect(fetchMock.called('/api/editActivity')).toBeTruthy();
  expect(screen.getByText('Failed to edit activity')).toBeInTheDocument();
}, 10000);

test('User can view historical data for past fitness activities successfully.', async () => {
  fetchMock.get('/api/historicalData', { status: 200, body: { data: [{ id: 1, name: 'Running' }] } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-historical-data'));
  });

  expect(fetchMock.called('/api/historicalData')).toBeTruthy();
  expect(screen.getByText('Running')).toBeInTheDocument();
}, 10000);

test('User sees an error message when viewing historical data fails.', async () => {
  fetchMock.get('/api/historicalData', { status: 500, body: { error: 'Failed to fetch historical data' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-historical-data'));
  });

  expect(fetchMock.called('/api/historicalData')).toBeTruthy();
  expect(screen.getByText('Failed to fetch historical data')).toBeInTheDocument();
}, 10000);

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

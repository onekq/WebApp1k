import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './exportDataToCsv_joinFitnessChallenges_syncDataFromWearable';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should export fitness data to CSV successfully.', async () => {
  fetchMock.get('/api/data/export', { status: 200, body: 'csv-data' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('export-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/data/export')).toBe(true);
  expect(screen.getByText('Data exported successfully!')).toBeInTheDocument();
}, 10000);

test('should fail to export fitness data to CSV.', async () => {
  fetchMock.get('/api/data/export', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('export-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/data/export')).toBe(true);
  expect(screen.getByText('Export failed.')).toBeInTheDocument();
}, 10000);

test('should successfully join a fitness challenge', async () => {
  fetchMock.post('/api/challenges/join/123', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App challengeId="123" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/join challenge/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/joined successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when joining a fitness challenge fails', async () => {
  fetchMock.post('/api/challenges/join/123', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App challengeId="123" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/join challenge/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to join/i)).toBeInTheDocument();
}, 10000);

test('should sync data from connected wearable device successfully.', async () => {
  fetchMock.get('/api/device/sync', { status: 200, body: { data: 'some-data' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sync-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/device/sync')).toBe(true);
  expect(screen.getByText('Data synced successfully!')).toBeInTheDocument();
}, 10000);

test('should fail to sync data from connected wearable device.', async () => {
  fetchMock.get('/api/device/sync', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sync-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/device/sync')).toBe(true);
  expect(screen.getByText('Sync failed.')).toBeInTheDocument();
}, 10000);

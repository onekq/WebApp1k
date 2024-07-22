import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './syncDataFromWearable';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should sync data from connected wearable device successfully.', async () => {
  fetchMock.get('/api/device/sync', { status: 200, body: { data: 'some-data' } });
  
  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sync-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/device/sync')).toBe(true);
  expect(screen.getByText('Data synced successfully!')).toBeInTheDocument();
}, 10000);

test('should fail to sync data from connected wearable device.', async () => {
  fetchMock.get('/api/device/sync', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sync-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/device/sync')).toBe(true);
  expect(screen.getByText('Sync failed.')).toBeInTheDocument();
}, 10000);


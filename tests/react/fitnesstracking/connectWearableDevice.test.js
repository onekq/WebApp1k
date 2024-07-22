import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './connectWearableDevice';

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


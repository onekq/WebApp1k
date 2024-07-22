import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CustomNotificationTracking from './customNotificationTracking';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully tracks custom notification delivery.', async () => {
  fetchMock.get('/api/getCustomNotificationDelivery', { deliveryStatus: 'Success' });

  await act(async () => { render(<MemoryRouter><CustomNotificationTracking /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Success')).toBeInTheDocument();
}, 10000);

test('Fails to track custom notification delivery.', async () => {
  fetchMock.get('/api/getCustomNotificationDelivery', 500);

  await act(async () => { render(<MemoryRouter><CustomNotificationTracking /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to track delivery')).toBeInTheDocument();
}, 10000);
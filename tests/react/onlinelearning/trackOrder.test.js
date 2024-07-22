import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TrackOrder from './trackOrder';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully tracks order status', async () => {
  fetchMock.get('/order/status', { status: 200, body: { status: 'Shipped' } });

  await act(async () => { render(<MemoryRouter><TrackOrder /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Track Order')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shipped')).toBeInTheDocument();
}, 10000);

test('Fails to track order status', async () => {
  fetchMock.get('/order/status', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><TrackOrder /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Track Order')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Tracking failed')).toBeInTheDocument();
}, 10000);
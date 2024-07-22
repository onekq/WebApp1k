import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './trackOrderShipmentStatus';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Validate tracking order shipment status updates order details correctly.', async () => {
  fetchMock.get('/api/shipment-status', { status: 200, body: { status: 'Shipped', trackingNumber: '123456789' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('trackShipmentStatus')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shipped')).toBeInTheDocument();
  expect(screen.getByText('123456789')).toBeInTheDocument();
}, 10000);

test("Tracking order shipment status doesn't update details due to error.", async () => {
  fetchMock.get('/api/shipment-status', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('trackShipmentStatus')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error tracking shipment status.')).toBeInTheDocument();
}, 10000);


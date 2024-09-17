import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applyFlightDiscount_flightSearchAndBooking';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('ApplyFlightDiscount - apply discount code successfully', async () => {
  fetchMock.post('/api/apply-discount', { discountedCost: 180 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Discount Code'), { target: { value: 'DISCOUNT10' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Discount')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Discounted Cost: 180')).toBeInTheDocument();
}, 10000);

test('ApplyFlightDiscount - apply discount code fails with error message', async () => {
  fetchMock.post('/api/apply-discount', { throws: new Error('Invalid discount code') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Discount Code'), { target: { value: 'DISCOUNT10' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Discount')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid discount code')).toBeInTheDocument();
}, 10000);

test('SearchFlights - search flights successfully', async () => {
  fetchMock.get('/api/flights?origin=JFK&destination=LAX&date=2023-10-15', {
    flights: [{ id: 1, airline: 'Delta', price: 200, duration: '5h' }]
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Origin'), { target: { value: 'JFK' } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Destination'), { target: { value: 'LAX' } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2023-10-15' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Delta')).toBeInTheDocument();
}, 10000);

test('SearchFlights - search flights fails with error message', async () => {
  fetchMock.get('/api/flights?origin=JFK&destination=LAX&date=2023-10-15', { throws: new Error('Failed to fetch flights') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Origin'), { target: { value: 'JFK' } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Destination'), { target: { value: 'LAX' } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2023-10-15' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch flights')).toBeInTheDocument();
}, 10000);
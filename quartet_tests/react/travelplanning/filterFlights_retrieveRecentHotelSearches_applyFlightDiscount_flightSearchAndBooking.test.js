import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterFlights_retrieveRecentHotelSearches_applyFlightDiscount_flightSearchAndBooking';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('FilterFlights - filter flights by price successfully (from filterFlights_retrieveRecentHotelSearches)', async () => {
  fetchMock.get('/api/flights?filter=price', {
    flights: [{ id: 1, airline: 'Delta', price: 200, duration: '5h' }]
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Sort By'), { target: { value: 'price' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Delta')).toBeInTheDocument();
}, 10000);

test('FilterFlights - filter flights by price fails with error message (from filterFlights_retrieveRecentHotelSearches)', async () => {
  fetchMock.get('/api/flights?filter=price', { throws: new Error('Failed to filter flights') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Sort By'), { target: { value: 'price' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter flights')).toBeInTheDocument();
}, 10000);

test('retrieveRecentHotelSearches - retrieves recent hotel searches successfully (from filterFlights_retrieveRecentHotelSearches)', async () => {
  fetchMock.get('/api/hotels/recent', {
    body: [{ id: 4, name: 'Recent Hotel' }],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('retrieve-recent-searches'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recent Hotel')).toBeInTheDocument();
}, 10000);

test('retrieveRecentHotelSearches - shows error message when retrieval fails (from filterFlights_retrieveRecentHotelSearches)', async () => {
  fetchMock.get('/api/hotels/recent', {
    body: { message: 'Retrieval Error' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('retrieve-recent-searches'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Retrieval Error')).toBeInTheDocument();
}, 10000);

test('ApplyFlightDiscount - apply discount code successfully (from applyFlightDiscount_flightSearchAndBooking)', async () => {
  fetchMock.post('/api/apply-discount', { discountedCost: 180 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Discount Code'), { target: { value: 'DISCOUNT10' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Discount')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Discounted Cost: 180')).toBeInTheDocument();
}, 10000);

test('ApplyFlightDiscount - apply discount code fails with error message (from applyFlightDiscount_flightSearchAndBooking)', async () => {
  fetchMock.post('/api/apply-discount', { throws: new Error('Invalid discount code') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Discount Code'), { target: { value: 'DISCOUNT10' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Discount')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid discount code')).toBeInTheDocument();
}, 10000);

test('SearchFlights - search flights successfully (from applyFlightDiscount_flightSearchAndBooking)', async () => {
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

test('SearchFlights - search flights fails with error message (from applyFlightDiscount_flightSearchAndBooking)', async () => {
  fetchMock.get('/api/flights?origin=JFK&destination=LAX&date=2023-10-15', { throws: new Error('Failed to fetch flights') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Origin'), { target: { value: 'JFK' } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Destination'), { target: { value: 'LAX' } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2023-10-15' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch flights')).toBeInTheDocument();
}, 10000);


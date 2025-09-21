import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './cancelFlightBooking_recommendTransportationOptions_retrieveRecentFlightSearches';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('CancelFlightBooking - cancel flight booking successfully', async () => {
  fetchMock.post('/api/cancel-booking', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Cancel Booking')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Booking cancelled successfully')).toBeInTheDocument();
}, 10000);

test('CancelFlightBooking - cancel flight booking fails with error message', async () => {
  fetchMock.post('/api/cancel-booking', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Cancel Booking')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to cancel booking')).toBeInTheDocument();
}, 10000);

test('should render recommended transportation options at the destination', async () => {
  fetchMock.get('/api/transportation', { transportation: ['Rental Car', 'Metro'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'New York' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Transportation Options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Rental Car')).toBeInTheDocument();
}, 10000);

test('should show error if fetching transportation options fails', async () => {
  fetchMock.get('/api/transportation', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'New York' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Transportation Options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load transportation options')).toBeInTheDocument();
}, 10000);

test('RetrieveRecentFlightSearches - retrieve recent flight searches successfully', async () => {
  fetchMock.get('/api/recent-searches', {
    searches: [{ id: 1, origin: 'SFO', destination: 'NYC' }]
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Recent Searches')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('SFO to NYC')).toBeInTheDocument();
}, 10000);

test('RetrieveRecentFlightSearches - retrieve recent flight search fails with error message', async () => {
  fetchMock.get('/api/recent-searches', { throws: new Error('Failed to retrieve recent searches') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Recent Searches')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to retrieve recent searches')).toBeInTheDocument();
}, 10000);

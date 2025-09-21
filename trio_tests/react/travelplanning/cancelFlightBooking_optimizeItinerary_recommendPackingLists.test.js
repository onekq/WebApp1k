import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './cancelFlightBooking_optimizeItinerary_recommendPackingLists';

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

test('successfully optimizes itinerary for travel time and convenience.', async () => {
  fetchMock.post('/api/optimize-itinerary', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('optimize-itinerary-button')); });

  expect(fetchMock.calls('/api/optimize-itinerary', 'POST')).toHaveLength(1);
  expect(screen.getByText('Itinerary optimized')).toBeInTheDocument();
}, 10000);

test('fails to optimize itinerary due to server error.', async () => {
  fetchMock.post('/api/optimize-itinerary', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('optimize-itinerary-button')); });

  expect(fetchMock.calls('/api/optimize-itinerary', 'POST')).toHaveLength(1);
  expect(screen.getByText('Server error')).toBeInTheDocument();
}, 10000);

test('should render recommended packing lists based on destination and trip duration', async () => {
  fetchMock.get('/api/packing-lists', { packingList: ['Sunscreen', 'Swimwear'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination and duration'), { target: { value: 'Hawaii, 7 days' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Packing List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sunscreen')).toBeInTheDocument();
}, 10000);

test('should show error if fetching recommended packing lists fails', async () => {
  fetchMock.get('/api/packing-lists', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination and duration'), { target: { value: 'Hawaii, 7 days' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Packing List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load packing lists')).toBeInTheDocument();
}, 10000);

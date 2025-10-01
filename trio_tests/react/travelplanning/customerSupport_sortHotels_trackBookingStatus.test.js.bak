import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customerSupport_sortHotels_trackBookingStatus';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Customer support options should be provided successfully.', async () => {
  fetchMock.get('/api/support/options', [{ id: 1, method: 'Phone' }]);

  await act(async () => { render(<MemoryRouter><CustomerSupportComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('get-support-options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('support-options')).toBeInTheDocument();
}, 10000);

test('Error in offering customer support should show error message.', async () => {
  fetchMock.get('/api/support/options', 500);

  await act(async () => { render(<MemoryRouter><CustomerSupportComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('get-support-options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('support-error')).toBeInTheDocument();
}, 10000);

test('sortHotels - sorts hotel search results successfully', async () => {
  fetchMock.get('/api/hotels?sort=price', {
    body: [{ id: 3, name: 'Affordable Hotel' }],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('sort-price'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Affordable Hotel')).toBeInTheDocument();
}, 10000);

test('sortHotels - shows error message on sorting failure', async () => {
  fetchMock.get('/api/hotels?sort=price', {
    body: { message: 'Sorting Error' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('sort-price'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sorting Error')).toBeInTheDocument();
}, 10000);

test('Booking status should be tracked and shown to users.', async () => {
  fetchMock.get('/api/booking/status', { status: 'Confirmed' });

  await act(async () => { render(<MemoryRouter><BookingStatusComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('track-status')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('booking-status')).toBeInTheDocument();
}, 10000);

test('Error in tracking booking status should show error message.', async () => {
  fetchMock.get('/api/booking/status', 404);

  await act(async () => { render(<MemoryRouter><BookingStatusComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('track-status')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('status-error')).toBeInTheDocument();
}, 10000);

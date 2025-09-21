import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applyHotelDiscount_cancelHotelBooking_offerTravelTips';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('applyHotelDiscount - applies discount code successfully to hotel booking', async () => {
  fetchMock.post('/api/hotels/1/apply-discount', {
    body: { total: 180 },
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('discount-code-input'), { target: { value: 'DISCOUNT10' } });
    fireEvent.click(screen.getByTestId('apply-discount-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('$180')).toBeInTheDocument();
}, 10000);

test('applyHotelDiscount - shows error message when discount code application fails', async () => {
  fetchMock.post('/api/hotels/1/apply-discount', {
    body: { message: 'Invalid Discount Code' },
    status: 400,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('discount-code-input'), { target: { value: 'DISCOUNT10' } });
    fireEvent.click(screen.getByTestId('apply-discount-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid Discount Code')).toBeInTheDocument();
}, 10000);

test('cancelHotelBooking - cancels hotel booking and processes refund calculation', async () => {
  fetchMock.post('/api/hotels/1/cancel', {
    body: { refund: 100 },
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('cancel-booking-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Refund: $100')).toBeInTheDocument();
}, 10000);

test('cancelHotelBooking - shows error message when cancellation fails', async () => {
  fetchMock.post('/api/hotels/1/cancel', {
    body: { message: 'Cancellation Error' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('cancel-booking-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Cancellation Error')).toBeInTheDocument();
}, 10000);

test('should render travel tips and local customs information', async () => {
  fetchMock.get('/api/tips', { tips: ['Avoid peak travel times', 'Learn basic phrases'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'France' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Tips')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Avoid peak travel times')).toBeInTheDocument();
}, 10000);

test('should show error if fetching travel tips fails', async () => {
  fetchMock.get('/api/tips', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'France' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Tips')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load tips')).toBeInTheDocument();
}, 10000);

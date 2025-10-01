import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applyHotelDiscount_handleBookingModifications_suggestActivities';

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

test('Booking should be modified successfully for valid request.', async () => {
  fetchMock.put('/api/booking/modify', 200);

  await act(async () => { render(<MemoryRouter><BookingModificationComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('booking-id'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('modify-booking')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('modification-success')).toBeInTheDocument();
}, 10000);

test('Error in booking modification should show error message.', async () => {
  fetchMock.put('/api/booking/modify', 400);

  await act(async () => { render(<MemoryRouter><BookingModificationComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('booking-id'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('modify-booking')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('modification-error')).toBeInTheDocument();
}, 10000);

test('should render suggested activities at the destination', async () => {
  fetchMock.get('/api/activities', { activities: ['Hiking', 'Snorkeling'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'Hawaii' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Activities')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Hiking')).toBeInTheDocument();
}, 10000);

test('should show error if fetching suggested activities fails', async () => {
  fetchMock.get('/api/activities', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'Hawaii' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Activities')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load activities')).toBeInTheDocument();
}, 10000);

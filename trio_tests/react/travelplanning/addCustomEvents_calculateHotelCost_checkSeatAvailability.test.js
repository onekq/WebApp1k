import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addCustomEvents_calculateHotelCost_checkSeatAvailability';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully adds custom events to an itinerary.', async () => {
  fetchMock.post('/api/add-event', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('event-input'), { target: { value: 'Event1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-event-button')); });

  expect(fetchMock.calls('/api/add-event', 'POST')).toHaveLength(1);
  expect(screen.getByTestId('event1')).toBeInTheDocument();
}, 10000);

test('fails to add custom events due to network error.', async () => {
  fetchMock.post('/api/add-event', { status: 500, body: { error: 'Network error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('event-input'), { target: { value: 'Event1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-event-button')); });

  expect(fetchMock.calls('/api/add-event', 'POST')).toHaveLength(1);
  expect(screen.getByText('Network error')).toBeInTheDocument();
}, 10000);

test('calculateHotelCost - calculates total hotel cost including taxes and fees', async () => {
  fetchMock.get('/api/hotels/1/cost', {
    body: { total: 200 },
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-cost-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('$200')).toBeInTheDocument();
}, 10000);

test('calculateHotelCost - shows error message when cost calculation fails', async () => {
  fetchMock.get('/api/hotels/1/cost', {
    body: { message: 'Cost Calculation Error' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-cost-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Cost Calculation Error')).toBeInTheDocument();
}, 10000);

test('CheckSeatAvailability - check seat availability successfully', async () => {
  fetchMock.get('/api/seat-availability', { available: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Check Seat Availability')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Seats are available')).toBeInTheDocument();
}, 10000);

test('CheckSeatAvailability - check seat availability fails with error message', async () => {
  fetchMock.get('/api/seat-availability', { available: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Check Seat Availability')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Seats are not available')).toBeInTheDocument();
}, 10000);

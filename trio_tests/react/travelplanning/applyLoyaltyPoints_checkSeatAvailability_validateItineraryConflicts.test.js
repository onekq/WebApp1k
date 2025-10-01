import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applyLoyaltyPoints_checkSeatAvailability_validateItineraryConflicts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Loyalty points should be calculated and applied for valid bookings.', async () => {
  fetchMock.post('/api/loyalty', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-loyalty')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('loyalty-success')).toBeInTheDocument();
}, 10000);

test('Error in applying loyalty points should show error message.', async () => {
  fetchMock.post('/api/loyalty', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-loyalty')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('loyalty-error')).toBeInTheDocument();
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

test('successfully validates itinerary conflicts.', async () => {
  fetchMock.post('/api/validate-conflicts', { status: 200, body: { conflicts: [] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-conflicts-button')); });

  expect(fetchMock.calls('/api/validate-conflicts', 'POST')).toHaveLength(1);
  expect(screen.getByText('No conflicts')).toBeInTheDocument();
}, 10000);

test('fails to validate itinerary conflicts due to conflicts.', async () => {
  fetchMock.post('/api/validate-conflicts', { status: 400, body: { conflicts: ['Conflict1'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-conflicts-button')); });

  expect(fetchMock.calls('/api/validate-conflicts', 'POST')).toHaveLength(1);
  expect(screen.getByText('Conflict1')).toBeInTheDocument();
}, 10000);

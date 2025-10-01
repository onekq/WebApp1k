import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateItineraryCost_checkRoomAvailability_notifyTravelAdvisories';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully calculates the total cost of the itinerary.', async () => {
  fetchMock.get('/api/calculate-cost', { status: 200, body: { totalCost: 1000 } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-cost-button')); });

  expect(fetchMock.calls('/api/calculate-cost', 'GET')).toHaveLength(1);
  expect(screen.getByText('$1000')).toBeInTheDocument();
}, 10000);

test('fails to calculate cost due to server error.', async () => {
  fetchMock.get('/api/calculate-cost', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-cost-button')); });

  expect(fetchMock.calls('/api/calculate-cost', 'GET')).toHaveLength(1);
  expect(screen.getByText('Server error')).toBeInTheDocument();
}, 10000);

test('checkRoomAvailability - checks room availability for selected hotels', async () => {
  fetchMock.get('/api/hotels/1/rooms?dates=2023-01-01_to_2023-01-10', {
    body: { available: true },
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('check-availability-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Available')).toBeInTheDocument();
}, 10000);

test('checkRoomAvailability - shows error message when room availability check fails', async () => {
  fetchMock.get('/api/hotels/1/rooms?dates=2023-01-01_to_2023-01-10', {
    body: { available: false, message: 'No rooms available' },
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('check-availability-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No rooms available')).toBeInTheDocument();
}, 10000);

test('should render travel advisories and alerts', async () => {
  fetchMock.get('/api/advisories', { advisories: ['Avoid downtown area', 'Check local news'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'Mexico' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Advisories')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Avoid downtown area')).toBeInTheDocument();
}, 10000);

test('should show error if fetching travel advisories fails', async () => {
  fetchMock.get('/api/advisories', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'Mexico' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Advisories')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load advisories')).toBeInTheDocument();
}, 10000);

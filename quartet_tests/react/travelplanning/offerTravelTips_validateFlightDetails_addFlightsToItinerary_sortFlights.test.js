import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './offerTravelTips_validateFlightDetails_addFlightsToItinerary_sortFlights';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should render travel tips and local customs information (from offerTravelTips_validateFlightDetails)', async () => {
  fetchMock.get('/api/tips', { tips: ['Avoid peak travel times', 'Learn basic phrases'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'France' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Tips')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Avoid peak travel times')).toBeInTheDocument();
}, 10000);

test('should show error if fetching travel tips fails (from offerTravelTips_validateFlightDetails)', async () => {
  fetchMock.get('/api/tips', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'France' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Tips')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load tips')).toBeInTheDocument();
}, 10000);

test('ValidateFlightDetails - validate flight details successfully (from offerTravelTips_validateFlightDetails)', async () => {
  fetchMock.post('/api/validate-flight', { valid: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Flight Details')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Flight details are valid')).toBeInTheDocument();
}, 10000);

test('ValidateFlightDetails - validate flight details fails with error message (from offerTravelTips_validateFlightDetails)', async () => {
  fetchMock.post('/api/validate-flight', { valid: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Flight Details')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Flight details are not valid')).toBeInTheDocument();
}, 10000);

test('successfully adds flights to an itinerary. (from addFlightsToItinerary_sortFlights)', async () => {
  fetchMock.post('/api/add-flight', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('flight-input'), { target: { value: 'Flight1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-flight-button')); });

  expect(fetchMock.calls('/api/add-flight', 'POST')).toHaveLength(1);
  expect(screen.getByTestId('flight1')).toBeInTheDocument();
}, 10000);

test('fails to add flights due to network error. (from addFlightsToItinerary_sortFlights)', async () => {
  fetchMock.post('/api/add-flight', { status: 500, body: { error: 'Network error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('flight-input'), { target: { value: 'Flight1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-flight-button')); });

  expect(fetchMock.calls('/api/add-flight', 'POST')).toHaveLength(1);
  expect(screen.getByText('Network error')).toBeInTheDocument();
}, 10000);

test('SortFlights - sort flights by price successfully (from addFlightsToItinerary_sortFlights)', async () => {
  fetchMock.get('/api/flights?sort=price', {
    flights: [{ id: 1, airline: 'Delta', price: 200, duration: '5h' }]
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Sort By'), { target: { value: 'price' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Sort')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Delta')).toBeInTheDocument();
}, 10000);

test('SortFlights - sort flights by price fails with error message (from addFlightsToItinerary_sortFlights)', async () => {
  fetchMock.get('/api/flights?sort=price', { throws: new Error('Failed to sort flights') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Sort By'), { target: { value: 'price' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Sort')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort flights')).toBeInTheDocument();
}, 10000);


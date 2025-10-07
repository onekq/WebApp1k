import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './flightSearchAndBooking_sortHotels_handleBookingModifications_recommendTransportationOptions';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('SearchFlights - search flights successfully (from flightSearchAndBooking_sortHotels)', async () => {
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

test('SearchFlights - search flights fails with error message (from flightSearchAndBooking_sortHotels)', async () => {
  fetchMock.get('/api/flights?origin=JFK&destination=LAX&date=2023-10-15', { throws: new Error('Failed to fetch flights') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Origin'), { target: { value: 'JFK' } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Destination'), { target: { value: 'LAX' } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2023-10-15' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch flights')).toBeInTheDocument();
}, 10000);

test('sortHotels - sorts hotel search results successfully (from flightSearchAndBooking_sortHotels)', async () => {
  fetchMock.get('/api/hotels?sort=price', {
    body: [{ id: 3, name: 'Affordable Hotel' }],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('sort-price'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Affordable Hotel')).toBeInTheDocument();
}, 10000);

test('sortHotels - shows error message on sorting failure (from flightSearchAndBooking_sortHotels)', async () => {
  fetchMock.get('/api/hotels?sort=price', {
    body: { message: 'Sorting Error' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('sort-price'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sorting Error')).toBeInTheDocument();
}, 10000);

test('Booking should be modified successfully for valid request. (from handleBookingModifications_recommendTransportationOptions)', async () => {
  fetchMock.put('/api/booking/modify', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('booking-id'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('modify-booking')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('modification-success')).toBeInTheDocument();
}, 10000);

test('Error in booking modification should show error message. (from handleBookingModifications_recommendTransportationOptions)', async () => {
  fetchMock.put('/api/booking/modify', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('booking-id'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('modify-booking')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('modification-error')).toBeInTheDocument();
}, 10000);

test('should render recommended transportation options at the destination (from handleBookingModifications_recommendTransportationOptions)', async () => {
  fetchMock.get('/api/transportation', { transportation: ['Rental Car', 'Metro'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'New York' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Transportation Options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Rental Car')).toBeInTheDocument();
}, 10000);

test('should show error if fetching transportation options fails (from handleBookingModifications_recommendTransportationOptions)', async () => {
  fetchMock.get('/api/transportation', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'New York' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Transportation Options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load transportation options')).toBeInTheDocument();
}, 10000);


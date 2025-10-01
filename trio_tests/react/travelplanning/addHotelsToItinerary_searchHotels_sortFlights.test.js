import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addHotelsToItinerary_searchHotels_sortFlights';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully adds hotels to an itinerary.', async () => {
  fetchMock.post('/api/add-hotel', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('hotel-input'), { target: { value: 'Hotel1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-hotel-button')); });

  expect(fetchMock.calls('/api/add-hotel', 'POST')).toHaveLength(1);
  expect(screen.getByTestId('hotel1')).toBeInTheDocument();
}, 10000);

test('fails to add hotels due to network error.', async () => {
  fetchMock.post('/api/add-hotel', { status: 500, body: { error: 'Network error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('hotel-input'), { target: { value: 'Hotel1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-hotel-button')); });

  expect(fetchMock.calls('/api/add-hotel', 'POST')).toHaveLength(1);
  expect(screen.getByText('Network error')).toBeInTheDocument();
}, 10000);

test('searchHotels - should display hotel search results on successful search', async () => {
  fetchMock.get('/api/hotels?destination=Paris&dates=2023-01-01_to_2023-01-10&guests=2', {
    body: [{ id: 1, name: 'Hotel Paris' }],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('destination-input'), { target: { value: 'Paris' } });
    fireEvent.click(screen.getByTestId('search-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Hotel Paris')).toBeInTheDocument();
}, 10000);

test('searchHotels - should display an error message on search failure', async () => {
  fetchMock.get('/api/hotels?destination=Paris&dates=2023-01-01_to_2023-01-10&guests=2', {
    body: { message: 'Network Error' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('destination-input'), { target: { value: 'Paris' } });
    fireEvent.click(screen.getByTestId('search-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);

test('SortFlights - sort flights by price successfully', async () => {
  fetchMock.get('/api/flights?sort=price', {
    flights: [{ id: 1, airline: 'Delta', price: 200, duration: '5h' }]
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Sort By'), { target: { value: 'price' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Sort')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Delta')).toBeInTheDocument();
}, 10000);

test('SortFlights - sort flights by price fails with error message', async () => {
  fetchMock.get('/api/flights?sort=price', { throws: new Error('Failed to sort flights') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Sort By'), { target: { value: 'price' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Sort')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort flights')).toBeInTheDocument();
}, 10000);

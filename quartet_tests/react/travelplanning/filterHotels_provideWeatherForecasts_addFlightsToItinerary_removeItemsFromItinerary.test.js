import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterHotels_provideWeatherForecasts_addFlightsToItinerary_removeItemsFromItinerary';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('filterHotels - filters hotels successfully based on criteria (from filterHotels_provideWeatherForecasts)', async () => {
  fetchMock.get('/api/hotels?filters=star_5', {
    body: [{ id: 2, name: 'Luxury Hotel' }],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('filter-star-5'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Luxury Hotel')).toBeInTheDocument();
}, 10000);

test('filterHotels - shows error message when no hotels match the filters (from filterHotels_provideWeatherForecasts)', async () => {
  fetchMock.get('/api/hotels?filters=star_5', {
    body: [],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('filter-star-5'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No hotels available')).toBeInTheDocument();
}, 10000);

test('should render weather forecasts for travel dates (from filterHotels_provideWeatherForecasts)', async () => {
  fetchMock.get('/api/weather', { weather: ['Sunny', 'Rainy'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter travel dates'), { target: { value: '2023-12-25' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sunny')).toBeInTheDocument();
}, 10000);

test('should show error if fetching weather forecasts fails (from filterHotels_provideWeatherForecasts)', async () => {
  fetchMock.get('/api/weather', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter travel dates'), { target: { value: '2023-12-25' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load weather forecasts')).toBeInTheDocument();
}, 10000);

test('successfully adds flights to an itinerary. (from addFlightsToItinerary_removeItemsFromItinerary)', async () => {
  fetchMock.post('/api/add-flight', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('flight-input'), { target: { value: 'Flight1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-flight-button')); });

  expect(fetchMock.calls('/api/add-flight', 'POST')).toHaveLength(1);
  expect(screen.getByTestId('flight1')).toBeInTheDocument();
}, 10000);

test('fails to add flights due to network error. (from addFlightsToItinerary_removeItemsFromItinerary)', async () => {
  fetchMock.post('/api/add-flight', { status: 500, body: { error: 'Network error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('flight-input'), { target: { value: 'Flight1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-flight-button')); });

  expect(fetchMock.calls('/api/add-flight', 'POST')).toHaveLength(1);
  expect(screen.getByText('Network error')).toBeInTheDocument();
}, 10000);

test('successfully removes items from an itinerary. (from addFlightsToItinerary_removeItemsFromItinerary)', async () => {
  fetchMock.delete('/api/remove-item', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-item-button')); });

  expect(fetchMock.calls('/api/remove-item', 'DELETE')).toHaveLength(1);
  expect(screen.queryByTestId('item1')).not.toBeInTheDocument();
}, 10000);

test('fails to remove items due to network error. (from addFlightsToItinerary_removeItemsFromItinerary)', async () => {
  fetchMock.delete('/api/remove-item', { status: 500, body: { error: 'Network error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-item-button')); });

  expect(fetchMock.calls('/api/remove-item', 'DELETE')).toHaveLength(1);
  expect(screen.getByText('Network error')).toBeInTheDocument();
}, 10000);


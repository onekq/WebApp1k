import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateHotelCost_savePreferredHotels_provideWeatherForecasts_shareItinerary';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('calculateHotelCost - calculates total hotel cost including taxes and fees (from calculateHotelCost_savePreferredHotels)', async () => {
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

test('calculateHotelCost - shows error message when cost calculation fails (from calculateHotelCost_savePreferredHotels)', async () => {
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

test('savePreferredHotels - saves preferred hotels to a wishlist successfully (from calculateHotelCost_savePreferredHotels)', async () => {
  fetchMock.post('/api/hotels/1/wishlist', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('save-wishlist-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Hotel saved to wishlist')).toBeInTheDocument();
}, 10000);

test('savePreferredHotels - shows error message when saving to wishlist fails (from calculateHotelCost_savePreferredHotels)', async () => {
  fetchMock.post('/api/hotels/1/wishlist', {
    body: { message: 'Save Failed' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('save-wishlist-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Save Failed')).toBeInTheDocument();
}, 10000);

test('should render weather forecasts for travel dates (from provideWeatherForecasts_shareItinerary)', async () => {
  fetchMock.get('/api/weather', { weather: ['Sunny', 'Rainy'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter travel dates'), { target: { value: '2023-12-25' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sunny')).toBeInTheDocument();
}, 10000);

test('should show error if fetching weather forecasts fails (from provideWeatherForecasts_shareItinerary)', async () => {
  fetchMock.get('/api/weather', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter travel dates'), { target: { value: '2023-12-25' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load weather forecasts')).toBeInTheDocument();
}, 10000);

test('successfully shares an itinerary with other users. (from provideWeatherForecasts_shareItinerary)', async () => {
  fetchMock.post('/api/share-itinerary', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('share-input'), { target: { value: 'user@example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-itinerary-button')); });

  expect(fetchMock.calls('/api/share-itinerary', 'POST')).toHaveLength(1);
  expect(screen.getByText('Itinerary shared')).toBeInTheDocument();
}, 10000);

test('fails to share itinerary due to invalid email. (from provideWeatherForecasts_shareItinerary)', async () => {
  fetchMock.post('/api/share-itinerary', { status: 400, body: { error: 'Invalid email address' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('share-input'), { target: { value: 'invalid-email' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-itinerary-button')); });

  expect(fetchMock.calls('/api/share-itinerary', 'POST')).toHaveLength(1);
  expect(screen.getByText('Invalid email address')).toBeInTheDocument();
}, 10000);


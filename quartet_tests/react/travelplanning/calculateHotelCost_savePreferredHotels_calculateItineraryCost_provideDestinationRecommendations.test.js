import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateHotelCost_savePreferredHotels_calculateItineraryCost_provideDestinationRecommendations';

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

test('successfully calculates the total cost of the itinerary. (from calculateItineraryCost_provideDestinationRecommendations)', async () => {
  fetchMock.get('/api/calculate-cost', { status: 200, body: { totalCost: 1000 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-cost-button')); });

  expect(fetchMock.calls('/api/calculate-cost', 'GET')).toHaveLength(1);
  expect(screen.getByText('$1000')).toBeInTheDocument();
}, 10000);

test('fails to calculate cost due to server error. (from calculateItineraryCost_provideDestinationRecommendations)', async () => {
  fetchMock.get('/api/calculate-cost', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-cost-button')); });

  expect(fetchMock.calls('/api/calculate-cost', 'GET')).toHaveLength(1);
  expect(screen.getByText('Server error')).toBeInTheDocument();
}, 10000);

test('should render destination recommendations based on user preferences (from calculateItineraryCost_provideDestinationRecommendations)', async () => {
  fetchMock.get('/api/recommendations', { destinations: ['Paris', 'London', 'Tokyo'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter preferences'), { target: { value: 'beach' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Recommendations')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Paris')).toBeInTheDocument();
}, 10000);

test('should show error if fetching destination recommendations fails (from calculateItineraryCost_provideDestinationRecommendations)', async () => {
  fetchMock.get('/api/recommendations', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter preferences'), { target: { value: 'beach' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Recommendations')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load recommendations')).toBeInTheDocument();
}, 10000);


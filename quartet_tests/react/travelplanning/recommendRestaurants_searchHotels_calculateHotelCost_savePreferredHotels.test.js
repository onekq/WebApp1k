import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './recommendRestaurants_searchHotels_calculateHotelCost_savePreferredHotels';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should render recommended restaurants at the destination (from recommendRestaurants_searchHotels)', async () => {
  fetchMock.get('/api/restaurants', { restaurants: ['French Bistro', 'Sushi Place'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'Tokyo' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Restaurants')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('French Bistro')).toBeInTheDocument();
}, 10000);

test('should show error if fetching recommended restaurants fails (from recommendRestaurants_searchHotels)', async () => {
  fetchMock.get('/api/restaurants', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'Tokyo' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Restaurants')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load restaurants')).toBeInTheDocument();
}, 10000);

test('searchHotels - should display hotel search results on successful search (from recommendRestaurants_searchHotels)', async () => {
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

test('searchHotels - should display an error message on search failure (from recommendRestaurants_searchHotels)', async () => {
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


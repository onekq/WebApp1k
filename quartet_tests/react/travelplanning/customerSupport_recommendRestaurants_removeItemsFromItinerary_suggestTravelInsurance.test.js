import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customerSupport_recommendRestaurants_removeItemsFromItinerary_suggestTravelInsurance';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Customer support options should be provided successfully. (from customerSupport_recommendRestaurants)', async () => {
  fetchMock.get('/api/support/options', [{ id: 1, method: 'Phone' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('get-support-options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('support-options')).toBeInTheDocument();
}, 10000);

test('Error in offering customer support should show error message. (from customerSupport_recommendRestaurants)', async () => {
  fetchMock.get('/api/support/options', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('get-support-options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('support-error')).toBeInTheDocument();
}, 10000);

test('should render recommended restaurants at the destination (from customerSupport_recommendRestaurants)', async () => {
  fetchMock.get('/api/restaurants', { restaurants: ['French Bistro', 'Sushi Place'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'Tokyo' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Restaurants')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('French Bistro')).toBeInTheDocument();
}, 10000);

test('should show error if fetching recommended restaurants fails (from customerSupport_recommendRestaurants)', async () => {
  fetchMock.get('/api/restaurants', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'Tokyo' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Restaurants')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load restaurants')).toBeInTheDocument();
}, 10000);

test('successfully removes items from an itinerary. (from removeItemsFromItinerary_suggestTravelInsurance)', async () => {
  fetchMock.delete('/api/remove-item', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-item-button')); });

  expect(fetchMock.calls('/api/remove-item', 'DELETE')).toHaveLength(1);
  expect(screen.queryByTestId('item1')).not.toBeInTheDocument();
}, 10000);

test('fails to remove items due to network error. (from removeItemsFromItinerary_suggestTravelInsurance)', async () => {
  fetchMock.delete('/api/remove-item', { status: 500, body: { error: 'Network error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-item-button')); });

  expect(fetchMock.calls('/api/remove-item', 'DELETE')).toHaveLength(1);
  expect(screen.getByText('Network error')).toBeInTheDocument();
}, 10000);

test('should render suggested travel insurance options (from removeItemsFromItinerary_suggestTravelInsurance)', async () => {
  fetchMock.get('/api/insurance', { insurance: ['InsureMyTrip', 'World Nomads'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination and travel dates'), { target: { value: 'USA, 2024-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Insurance')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('InsureMyTrip')).toBeInTheDocument();
}, 10000);

test('should show error if fetching travel insurance options fails (from removeItemsFromItinerary_suggestTravelInsurance)', async () => {
  fetchMock.get('/api/insurance', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination and travel dates'), { target: { value: 'USA, 2024-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Insurance')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load insurance options')).toBeInTheDocument();
}, 10000);


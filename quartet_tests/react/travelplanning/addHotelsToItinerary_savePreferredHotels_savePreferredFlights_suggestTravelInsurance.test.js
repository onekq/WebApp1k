import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addHotelsToItinerary_savePreferredHotels_savePreferredFlights_suggestTravelInsurance';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds hotels to an itinerary. (from addHotelsToItinerary_savePreferredHotels)', async () => {
  fetchMock.post('/api/add-hotel', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('hotel-input'), { target: { value: 'Hotel1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-hotel-button')); });

  expect(fetchMock.calls('/api/add-hotel', 'POST')).toHaveLength(1);
  expect(screen.getByTestId('hotel1')).toBeInTheDocument();
}, 10000);

test('fails to add hotels due to network error. (from addHotelsToItinerary_savePreferredHotels)', async () => {
  fetchMock.post('/api/add-hotel', { status: 500, body: { error: 'Network error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('hotel-input'), { target: { value: 'Hotel1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-hotel-button')); });

  expect(fetchMock.calls('/api/add-hotel', 'POST')).toHaveLength(1);
  expect(screen.getByText('Network error')).toBeInTheDocument();
}, 10000);

test('savePreferredHotels - saves preferred hotels to a wishlist successfully (from addHotelsToItinerary_savePreferredHotels)', async () => {
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

test('savePreferredHotels - shows error message when saving to wishlist fails (from addHotelsToItinerary_savePreferredHotels)', async () => {
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

test('SavePreferredFlights - save preferred flight successfully (from savePreferredFlights_suggestTravelInsurance)', async () => {
  fetchMock.post('/api/save-flight', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Flight')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Flight saved to wishlist')).toBeInTheDocument();
}, 10000);

test('SavePreferredFlights - save preferred flight fails with error message (from savePreferredFlights_suggestTravelInsurance)', async () => {
  fetchMock.post('/api/save-flight', { throws: new Error('Failed to save flight') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Flight')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save flight')).toBeInTheDocument();
}, 10000);

test('should render suggested travel insurance options (from savePreferredFlights_suggestTravelInsurance)', async () => {
  fetchMock.get('/api/insurance', { insurance: ['InsureMyTrip', 'World Nomads'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination and travel dates'), { target: { value: 'USA, 2024-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Insurance')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('InsureMyTrip')).toBeInTheDocument();
}, 10000);

test('should show error if fetching travel insurance options fails (from savePreferredFlights_suggestTravelInsurance)', async () => {
  fetchMock.get('/api/insurance', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination and travel dates'), { target: { value: 'USA, 2024-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Insurance')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load insurance options')).toBeInTheDocument();
}, 10000);


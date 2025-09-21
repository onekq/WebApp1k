import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addHotelsToItinerary_offerLoyaltyProgramBenefits_recommendRestaurants';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully adds hotels to an itinerary.', async () => {
  fetchMock.post('/api/add-hotel', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('hotel-input'), { target: { value: 'Hotel1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-hotel-button')); });

  expect(fetchMock.calls('/api/add-hotel', 'POST')).toHaveLength(1);
  expect(screen.getByTestId('hotel1')).toBeInTheDocument();
}, 10000);

test('fails to add hotels due to network error.', async () => {
  fetchMock.post('/api/add-hotel', { status: 500, body: { error: 'Network error' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('hotel-input'), { target: { value: 'Hotel1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-hotel-button')); });

  expect(fetchMock.calls('/api/add-hotel', 'POST')).toHaveLength(1);
  expect(screen.getByText('Network error')).toBeInTheDocument();
}, 10000);

test('should render loyalty program benefits and reward points', async () => {
  fetchMock.get('/api/loyalty', { benefits: ['Double Points', 'Free Upgrades'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter loyalty program'), { target: { value: 'Frequent Flyer' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Benefits')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Double Points')).toBeInTheDocument();
}, 10000);

test('should show error if fetching loyalty program benefits fails', async () => {
  fetchMock.get('/api/loyalty', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter loyalty program'), { target: { value: 'Frequent Flyer' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Benefits')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load benefits')).toBeInTheDocument();
}, 10000);

test('should render recommended restaurants at the destination', async () => {
  fetchMock.get('/api/restaurants', { restaurants: ['French Bistro', 'Sushi Place'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'Tokyo' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Restaurants')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('French Bistro')).toBeInTheDocument();
}, 10000);

test('should show error if fetching recommended restaurants fails', async () => {
  fetchMock.get('/api/restaurants', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'Tokyo' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Restaurants')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load restaurants')).toBeInTheDocument();
}, 10000);

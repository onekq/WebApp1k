import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addFlightsToItinerary_offerLoyaltyProgramBenefits_savePreferredFlights';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully adds flights to an itinerary.', async () => {
  fetchMock.post('/api/add-flight', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('flight-input'), { target: { value: 'Flight1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-flight-button')); });

  expect(fetchMock.calls('/api/add-flight', 'POST')).toHaveLength(1);
  expect(screen.getByTestId('flight1')).toBeInTheDocument();
}, 10000);

test('fails to add flights due to network error.', async () => {
  fetchMock.post('/api/add-flight', { status: 500, body: { error: 'Network error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('flight-input'), { target: { value: 'Flight1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-flight-button')); });

  expect(fetchMock.calls('/api/add-flight', 'POST')).toHaveLength(1);
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

test('SavePreferredFlights - save preferred flight successfully', async () => {
  fetchMock.post('/api/save-flight', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Flight')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Flight saved to wishlist')).toBeInTheDocument();
}, 10000);

test('SavePreferredFlights - save preferred flight fails with error message', async () => {
  fetchMock.post('/api/save-flight', { throws: new Error('Failed to save flight') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Flight')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save flight')).toBeInTheDocument();
}, 10000);

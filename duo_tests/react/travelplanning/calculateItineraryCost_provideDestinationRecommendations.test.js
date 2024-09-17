import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateItineraryCost_provideDestinationRecommendations';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully calculates the total cost of the itinerary.', async () => {
  fetchMock.get('/api/calculate-cost', { status: 200, body: { totalCost: 1000 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-cost-button')); });

  expect(fetchMock.calls('/api/calculate-cost', 'GET')).toHaveLength(1);
  expect(screen.getByText('$1000')).toBeInTheDocument();
}, 10000);

test('fails to calculate cost due to server error.', async () => {
  fetchMock.get('/api/calculate-cost', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-cost-button')); });

  expect(fetchMock.calls('/api/calculate-cost', 'GET')).toHaveLength(1);
  expect(screen.getByText('Server error')).toBeInTheDocument();
}, 10000);

test('should render destination recommendations based on user preferences', async () => {
  fetchMock.get('/api/recommendations', { destinations: ['Paris', 'London', 'Tokyo'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter preferences'), { target: { value: 'beach' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Recommendations')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Paris')).toBeInTheDocument();
}, 10000);

test('should show error if fetching destination recommendations fails', async () => {
  fetchMock.get('/api/recommendations', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter preferences'), { target: { value: 'beach' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Recommendations')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load recommendations')).toBeInTheDocument();
}, 10000);
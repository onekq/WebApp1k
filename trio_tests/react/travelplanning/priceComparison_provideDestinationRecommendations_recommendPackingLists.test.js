import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './priceComparison_provideDestinationRecommendations_recommendPackingLists';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Price comparison should be provided for valid search.', async () => {
  fetchMock.post('/api/price/comparison', { price: 100 });

  await act(async () => { render(<MemoryRouter><PriceComparisonComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('compare-prices')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('price-comparison')).toBeInTheDocument();
}, 10000);

test('Error in providing price comparison should show error message.', async () => {
  fetchMock.post('/api/price/comparison', 500);

  await act(async () => { render(<MemoryRouter><PriceComparisonComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('compare-prices')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('comparison-error')).toBeInTheDocument();
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

test('should render recommended packing lists based on destination and trip duration', async () => {
  fetchMock.get('/api/packing-lists', { packingList: ['Sunscreen', 'Swimwear'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination and duration'), { target: { value: 'Hawaii, 7 days' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Packing List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sunscreen')).toBeInTheDocument();
}, 10000);

test('should show error if fetching recommended packing lists fails', async () => {
  fetchMock.get('/api/packing-lists', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination and duration'), { target: { value: 'Hawaii, 7 days' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Packing List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load packing lists')).toBeInTheDocument();
}, 10000);

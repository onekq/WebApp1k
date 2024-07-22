import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import PriceComparisonComponent from './priceComparison';

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


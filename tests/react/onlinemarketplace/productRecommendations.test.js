import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ProductRecommendations from './productRecommendations';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Product Recommendations successfully displays recommended products.', async () => {
  fetchMock.get('/api/recommendations', { status: 200, body: { products: ['Recommended Product 1'] } });

  await act(async () => { render(<MemoryRouter><ProductRecommendations /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('recommend-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recommended Product 1')).toBeInTheDocument();
}, 10000);

test('Product Recommendations fails and displays error message.', async () => {
  fetchMock.get('/api/recommendations', { status: 500 });

  await act(async () => { render(<MemoryRouter><ProductRecommendations /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('recommend-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recommendations')).toBeInTheDocument();
}, 10000);


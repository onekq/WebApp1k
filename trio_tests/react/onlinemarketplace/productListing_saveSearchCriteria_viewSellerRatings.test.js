import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './productListing_saveSearchCriteria_viewSellerRatings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Product listing succeeds with required details.', async () => {
  fetchMock.post('/api/products', { status: 200, body: { id: 1, name: 'Sample Product' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: 'Sample Product' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });

  expect(fetchMock.calls('/api/products').length).toBe(1);
  expect(screen.getByText('Product listed successfully')).toBeInTheDocument();
}, 10000);

test('Product listing fails with missing details error.', async () => {
  fetchMock.post('/api/products', { status: 400, body: { message: 'Missing required details' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });

  expect(fetchMock.calls('/api/products').length).toBe(1);
  expect(screen.getByText('Missing required details')).toBeInTheDocument();
}, 10000);

test('Save Search Criteria successfully saves search criteria.', async () => {
  fetchMock.post('/api/saveSearch', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Search criteria saved')).toBeInTheDocument();
}, 10000);

test('Save Search Criteria fails and displays error message.', async () => {
  fetchMock.post('/api/saveSearch', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save search criteria')).toBeInTheDocument();
}, 10000);

test('successfully views seller ratings.', async () => {
  const mockRatings = [
    { id: 1, rating: 5, comment: 'Excellent seller!' },
    { id: 2, rating: 4, comment: 'Very good service.' }
  ];
  fetchMock.get('/api/seller-ratings', { status: 200, body: mockRatings });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-ratings-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Excellent seller!')).toBeInTheDocument();
  expect(screen.getByText('Very good service.')).toBeInTheDocument();
}, 10000);

test('fails to view seller ratings with an error message.', async () => {
  fetchMock.get('/api/seller-ratings', { status: 400, body: { error: 'Failed to load ratings' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-ratings-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load ratings')).toBeInTheDocument();
}, 10000);

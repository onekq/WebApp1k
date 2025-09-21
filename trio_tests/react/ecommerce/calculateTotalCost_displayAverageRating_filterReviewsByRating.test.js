import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateTotalCost_displayAverageRating_filterReviewsByRating';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('calculateTotalCost: successfully display total cost including all charges', async () => {
  fetchMock.get('/api/cart/total', { status: 200, body: { total: '123.00' } });

  await act(async () => { render(<MemoryRouter><Cart /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-total')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Total: $123.00')).toBeInTheDocument();  
}, 10000);

test('calculateTotalCost: fail to display total cost with error message', async () => {
  fetchMock.get('/api/cart/total', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><Cart /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-total')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to calculate total cost')).toBeInTheDocument();  
}, 10000);

test('Displaying average product rating should show correct value', async () => {
  fetchMock.get('/api/reviews/average?productId=123', { averageRating: 4.5 });

  await act(async () => { render(<MemoryRouter><DisplayAverageRating productId="123" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews/average?productId=123')).toHaveLength(1);
  expect(screen.getByText('Average Rating: 4.5')).toBeInTheDocument();
}, 10000);

test('Displaying average product rating should fail to fetch data', async () => {
  fetchMock.get('/api/reviews/average?productId=123', { status: 500 });

  await act(async () => { render(<MemoryRouter><DisplayAverageRating productId="123" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews/average?productId=123')).toHaveLength(1);
  expect(screen.getByText('Failed to load average rating')).toBeInTheDocument();
}, 10000);

test('Filtering reviews by rating should display correct reviews', async () => {
  fetchMock.get('/api/reviews?rating=5', [{ id: 1, rating: 5, content: 'Great!' }]);

  await act(async () => { render(<MemoryRouter><FilterReviewsByRating rating={5} /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?rating=5')).toHaveLength(1);
  expect(screen.getByText('Great!')).toBeInTheDocument();
}, 10000);

test('Filtering reviews by rating should display no reviews for non-existent rating', async () => {
  fetchMock.get('/api/reviews?rating=5', []);

  await act(async () => { render(<MemoryRouter><FilterReviewsByRating rating={5} /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?rating=5')).toHaveLength(1);
  expect(screen.getByText('No reviews for this rating')).toBeInTheDocument();
}, 10000);

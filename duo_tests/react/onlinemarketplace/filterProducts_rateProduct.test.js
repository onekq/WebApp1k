import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterProducts_rateProduct';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Filter Products successfully filters products.', async () => {
  fetchMock.get('/api/filter', { status: 200, body: { results: ['Filtered Product 1'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-category')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Filtered Product 1')).toBeInTheDocument();
}, 10000);

test('Filter Products fails and displays error message.', async () => {
  fetchMock.get('/api/filter', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-category')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to apply filters')).toBeInTheDocument();
}, 10000);

test('Rate Product successfully submits a rating.', async () => {
  fetchMock.post('/api/rate', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('star-4')); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-rating-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Rating submitted')).toBeInTheDocument();
}, 10000);

test('Rate Product fails and displays error message.', async () => {
  fetchMock.post('/api/rate', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('star-4')); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-rating-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to submit rating')).toBeInTheDocument();
}, 10000);
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './refundProcessing_saveSearchCriteria_sellerRating';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('processes refund successfully.', async () => {
  fetchMock.post('/api/refund', { status: 200 });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Request Refund')); });

  expect(fetchMock.calls('/api/refund').length).toEqual(1);
  expect(screen.getByText('Refund processed successfully')).toBeInTheDocument();
}, 10000);

test('displays error on refund processing failure.', async () => {
  fetchMock.post('/api/refund', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Request Refund')); });

  expect(fetchMock.calls('/api/refund').length).toEqual(1);
  expect(screen.getByText('Refund processing failed')).toBeInTheDocument();
}, 10000);

test('Save Search Criteria successfully saves search criteria.', async () => {
  fetchMock.post('/api/saveSearch', { status: 200 });

  await act(async () => { render(<MemoryRouter><SaveSearchCriteria /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Search criteria saved')).toBeInTheDocument();
}, 10000);

test('Save Search Criteria fails and displays error message.', async () => {
  fetchMock.post('/api/saveSearch', { status: 500 });

  await act(async () => { render(<MemoryRouter><SaveSearchCriteria /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save search criteria')).toBeInTheDocument();
}, 10000);

test('successfully rates a seller with a success message.', async () => {
  fetchMock.post('/api/rate-seller', { status: 200, body: { message: 'Seller rated successfully' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rating-input'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rate-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Seller rated successfully')).toBeInTheDocument();
}, 10000);

test('fails to rate a seller with an error message.', async () => {
  fetchMock.post('/api/rate-seller', { status: 400, body: { error: 'Failed to rate seller' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rating-input'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rate-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to rate seller')).toBeInTheDocument();
}, 10000);

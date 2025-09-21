import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customerSupportTicketing_productDetails_saveSearchCriteria';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Customer Support Ticketing success creates a new ticket', async () => {
  fetchMock.post('/api/tickets', { id: 1, issue: 'Issue description' });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('issue-input'), { target: { value: 'Issue description' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit Ticket')); });

  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Ticket created')).toBeInTheDocument();
}, 10000);

test('Customer Support Ticketing failure shows error message', async () => {
  fetchMock.post('/api/tickets', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('issue-input'), { target: { value: 'Issue description' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit Ticket')); });

  expect(screen.getByText('Error creating ticket')).toBeInTheDocument();
}, 10000);

test('Product details retrieval and display succeed.', async () => {
  fetchMock.get('/api/products/1', { status: 200, body: { id: 1, name: 'Sample Product' } });

  await act(async () => { render(<MemoryRouter><ProductDetails productId={1} /></MemoryRouter>); });

  expect(fetchMock.calls('/api/products/1').length).toBe(1);
  expect(screen.getByText('Sample Product')).toBeInTheDocument();
}, 10000);

test('Product details retrieval fails with error message.', async () => {
  fetchMock.get('/api/products/1', { status: 404, body: { message: 'Product not found' } });

  await act(async () => { render(<MemoryRouter><ProductDetails productId={1} /></MemoryRouter>); });

  expect(fetchMock.calls('/api/products/1').length).toBe(1);
  expect(screen.getByText('Product not found')).toBeInTheDocument();
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

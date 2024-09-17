import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './disputeResolution_productDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Dispute Resolution success resolves the dispute', async () => {
  fetchMock.post('/api/orders/1/dispute', { status: 'Resolved' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Resolve Dispute')); });

  expect(fetchMock.calls('/api/orders/1/dispute').length).toBe(1);
  expect(screen.getByText('Dispute resolved')).toBeInTheDocument();
}, 10000);

test('Dispute Resolution failure shows error message', async () => {
  fetchMock.post('/api/orders/1/dispute', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Resolve Dispute')); });

  expect(screen.getByText('Error resolving dispute')).toBeInTheDocument();
}, 10000);

test('Product details retrieval and display succeed.', async () => {
  fetchMock.get('/api/products/1', { status: 200, body: { id: 1, name: 'Sample Product' } });

  await act(async () => { render(<MemoryRouter><App productId={1} /></MemoryRouter>); });

  expect(fetchMock.calls('/api/products/1').length).toBe(1);
  expect(screen.getByText('Sample Product')).toBeInTheDocument();
}, 10000);

test('Product details retrieval fails with error message.', async () => {
  fetchMock.get('/api/products/1', { status: 404, body: { message: 'Product not found' } });

  await act(async () => { render(<MemoryRouter><App productId={1} /></MemoryRouter>); });

  expect(fetchMock.calls('/api/products/1').length).toBe(1);
  expect(screen.getByText('Product not found')).toBeInTheDocument();
}, 10000);
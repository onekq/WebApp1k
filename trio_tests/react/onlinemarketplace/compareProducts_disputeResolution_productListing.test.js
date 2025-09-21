import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './compareProducts_disputeResolution_productListing';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Comparing multiple products succeeds.', async () => {
  fetchMock.post('/api/compare', { status: 200, body: [{ id: 1, name: 'Product A' }, { id: 2, name: 'Product B' }] });

  await act(async () => { render(<MemoryRouter><ComparePage /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Compare Products')); });

  expect(fetchMock.calls('/api/compare').length).toBe(1);
  expect(screen.getByText('Product A')).toBeInTheDocument();
  expect(screen.getByText('Product B')).toBeInTheDocument();
}, 10000);

test('Comparing multiple products fails with error message.', async () => {
  fetchMock.post('/api/compare', { status: 500, body: { message: 'Comparison failed' } });

  await act(async () => { render(<MemoryRouter><ComparePage /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Compare Products')); });

  expect(fetchMock.calls('/api/compare').length).toBe(1);
  expect(screen.getByText('Comparison failed')).toBeInTheDocument();
}, 10000);

test('Dispute Resolution success resolves the dispute', async () => {
  fetchMock.post('/api/orders/1/dispute', { status: 'Resolved' });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Resolve Dispute')); });

  expect(fetchMock.calls('/api/orders/1/dispute').length).toBe(1);
  expect(screen.getByText('Dispute resolved')).toBeInTheDocument();
}, 10000);

test('Dispute Resolution failure shows error message', async () => {
  fetchMock.post('/api/orders/1/dispute', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Resolve Dispute')); });

  expect(screen.getByText('Error resolving dispute')).toBeInTheDocument();
}, 10000);

test('Product listing succeeds with required details.', async () => {
  fetchMock.post('/api/products', { status: 200, body: { id: 1, name: 'Sample Product' } });

  await act(async () => { render(<MemoryRouter><ProductForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: 'Sample Product' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });

  expect(fetchMock.calls('/api/products').length).toBe(1);
  expect(screen.getByText('Product listed successfully')).toBeInTheDocument();
}, 10000);

test('Product listing fails with missing details error.', async () => {
  fetchMock.post('/api/products', { status: 400, body: { message: 'Missing required details' } });

  await act(async () => { render(<MemoryRouter><ProductForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });

  expect(fetchMock.calls('/api/products').length).toBe(1);
  expect(screen.getByText('Missing required details')).toBeInTheDocument();
}, 10000);

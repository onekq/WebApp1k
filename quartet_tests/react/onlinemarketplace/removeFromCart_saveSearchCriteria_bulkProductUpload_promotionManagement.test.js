import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './removeFromCart_saveSearchCriteria_bulkProductUpload_promotionManagement';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Removing a product from the cart succeeds. (from removeFromCart_saveSearchCriteria)', async () => {
  fetchMock.delete('/api/cart/1', { status: 200, body: { message: 'Removed from cart successfully' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove from Cart')); });

  expect(fetchMock.calls('/api/cart/1').length).toBe(1);
  expect(screen.getByText('Removed from cart successfully')).toBeInTheDocument();
}, 10000);

test('Removing a product from the cart fails with error message. (from removeFromCart_saveSearchCriteria)', async () => {
  fetchMock.delete('/api/cart/1', { status: 400, body: { message: 'Failed to remove from cart' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove from Cart')); });

  expect(fetchMock.calls('/api/cart/1').length).toBe(1);
  expect(screen.getByText('Failed to remove from cart')).toBeInTheDocument();
}, 10000);

test('Save Search Criteria successfully saves search criteria. (from removeFromCart_saveSearchCriteria)', async () => {
  fetchMock.post('/api/saveSearch', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Search criteria saved')).toBeInTheDocument();
}, 10000);

test('Save Search Criteria fails and displays error message. (from removeFromCart_saveSearchCriteria)', async () => {
  fetchMock.post('/api/saveSearch', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save search criteria')).toBeInTheDocument();
}, 10000);

test('Bulk product upload succeeds. (from bulkProductUpload_promotionManagement)', async () => {
  fetchMock.post('/api/bulk-upload', { status: 200, body: { message: 'Bulk upload successful' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('CSV File'), { target: { files: [new File([''], 'sample.csv')] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Upload')); });

  expect(fetchMock.calls('/api/bulk-upload').length).toBe(1);
  expect(screen.getByText('Bulk upload successful')).toBeInTheDocument();
}, 10000);

test('Bulk product upload fails with error message. (from bulkProductUpload_promotionManagement)', async () => {
  fetchMock.post('/api/bulk-upload', { status: 400, body: { message: 'Invalid file format' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('CSV File'), { target: { files: [new File([''], 'invalid_file.txt')] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Upload')); });

  expect(fetchMock.calls('/api/bulk-upload').length).toBe(1);
  expect(screen.getByText('Invalid file format')).toBeInTheDocument();
}, 10000);

test('manages promotions successfully. (from bulkProductUpload_promotionManagement)', async () => {
  fetchMock.post('/api/manage-promotion', { status: 200, body: { message: 'Promotion updated successfully' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('promotion-input'), { target: { value: '20% off' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-promotion-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Promotion updated successfully')).toBeInTheDocument();
}, 10000);

test('fails to manage promotions with an error message. (from bulkProductUpload_promotionManagement)', async () => {
  fetchMock.post('/api/manage-promotion', { status: 400, body: { error: 'Failed to update promotion' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('promotion-input'), { target: { value: '20% off' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-promotion-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update promotion')).toBeInTheDocument();
}, 10000);


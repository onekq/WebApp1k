import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './rateProduct_selectPaymentMethod_bulkProductUpload_promotionManagement';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Rate Product successfully submits a rating. (from rateProduct_selectPaymentMethod)', async () => {
  fetchMock.post('/api/rate', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('star-4')); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-rating-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Rating submitted')).toBeInTheDocument();
}, 10000);

test('Rate Product fails and displays error message. (from rateProduct_selectPaymentMethod)', async () => {
  fetchMock.post('/api/rate', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('star-4')); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-rating-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to submit rating')).toBeInTheDocument();
}, 10000);

test('validates selecting a payment method successfully. (from rateProduct_selectPaymentMethod)', async () => {
  fetchMock.post('/api/payment-method', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Select Payment Method')); });
  await act(async () => { fireEvent.click(screen.getByText('Credit Card')); });

  expect(fetchMock.calls('/api/payment-method').length).toEqual(1);
  expect(screen.getByText('Credit Card selected')).toBeInTheDocument();
}, 10000);

test('displays error on invalid payment method selection. (from rateProduct_selectPaymentMethod)', async () => {
  fetchMock.post('/api/payment-method', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Select Payment Method')); });
  await act(async () => { fireEvent.click(screen.getByText('Expired Card')); });

  expect(fetchMock.calls('/api/payment-method').length).toEqual(1);
  expect(screen.getByText('Invalid payment method selected')).toBeInTheDocument();
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


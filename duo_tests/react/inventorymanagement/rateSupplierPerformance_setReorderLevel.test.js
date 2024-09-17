import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './rateSupplierPerformance_setReorderLevel';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully rates supplier performance.', async () => {
  fetchMock.post('/api/suppliers/1/rate', { status: 200, body: { rating: 5 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('rate-supplier-button')); });

  expect(fetchMock.called('/api/suppliers/1/rate')).toBe(true);
  expect(screen.getByText('Rating: 5')).toBeInTheDocument();
}, 10000);

test('Fails to rate supplier performance.', async () => {
  fetchMock.post('/api/suppliers/1/rate', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('rate-supplier-button')); });

  expect(fetchMock.called('/api/suppliers/1/rate')).toBe(true);
  expect(screen.getByText('Failed to rate supplier')).toBeInTheDocument();
}, 10000);

test('Triggers alert on setting reorder level successfully', async () => {
  fetchMock.post('/api/reorder/level', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Reorder Level/i), { target: { value: 30 } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Reorder Level/i)); });

  expect(fetchMock.calls('/api/reorder/level').length).toBe(1);
  expect(screen.getByText(/Reorder level set successfully/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when setting reorder level', async () => {
  fetchMock.post('/api/reorder/level', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Reorder Level/i), { target: { value: 30 } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Reorder Level/i)); });

  expect(fetchMock.calls('/api/reorder/level').length).toBe(1);
  expect(screen.getByText(/Error setting reorder level/i)).toBeInTheDocument();
}, 10000);
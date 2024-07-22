import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './setStockThresholds';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Triggers alert on setting stock threshold successfully', async () => {
  fetchMock.post('/api/stock/threshold', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Stock Threshold/i), { target: { value: 15 } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Threshold/i)); });

  expect(fetchMock.calls('/api/stock/threshold').length).toBe(1);
  expect(screen.getByText(/Threshold set successfully/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when setting stock threshold', async () => {
  fetchMock.post('/api/stock/threshold', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Stock Threshold/i), { target: { value: 15 } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Threshold/i)); });

  expect(fetchMock.calls('/api/stock/threshold').length).toBe(1);
  expect(screen.getByText(/Error setting threshold/i)).toBeInTheDocument();
}, 10000);


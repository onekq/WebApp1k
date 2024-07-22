import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './trackDamagedStock';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Updates inventory and status correctly for damaged stock', async () => {
  fetchMock.post('/api/stock/damaged', { success: true, updatedStock: 60 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Report Damaged Stock/i)); });

  expect(fetchMock.calls('/api/stock/damaged').length).toBe(1);
  expect(screen.getByText(/Damaged stock reported. Updated Stock: 60/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when reporting damaged stock', async () => {
  fetchMock.post('/api/stock/damaged', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Report Damaged Stock/i)); });

  expect(fetchMock.calls('/api/stock/damaged').length).toBe(1);
  expect(screen.getByText(/Error reporting damaged stock/i)).toBeInTheDocument();
}, 10000);
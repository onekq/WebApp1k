import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import InventoryTurnover from './analyzeInventoryTurnover';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Analyzes inventory turnover successfully.', async () => {
  fetchMock.post('/api/inventory-turnover', { body: { status: 'success', data: { turnover: 10 }}});

  await act(async () => { render(<MemoryRouter><InventoryTurnover /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('analyze-turnover')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Inventory Turnover: 10')).toBeInTheDocument();
}, 10000);

test('Fails to analyze inventory turnover due to server error.', async () => {
  fetchMock.post('/api/inventory-turnover', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><InventoryTurnover /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('analyze-turnover')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);


import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './manageMultipleWarehouses';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Reflects correct stock levels per warehouse on success', async () => {
  fetchMock.get('/api/warehouses', { warehouse1: 100, warehouse2: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/warehouses').length).toBe(1);
  expect(screen.getByText(/Warehouse1: 100/i)).toBeInTheDocument();
  expect(screen.getByText(/Warehouse2: 200/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when fetching warehouse data', async () => {
  fetchMock.get('/api/warehouses', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/warehouses').length).toBe(1);
  expect(screen.getByText(/Error fetching warehouse data/i)).toBeInTheDocument();
}, 10000);


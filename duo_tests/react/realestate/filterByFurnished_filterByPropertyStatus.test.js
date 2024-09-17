import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByFurnished_filterByPropertyStatus';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Filter by furnished properties successfully', async () => {
  fetchMock.get('/api/furnished-properties', { properties: [{ id: 1, name: "Furnished 1" }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-furnished-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Furnished 1')).toBeInTheDocument();
}, 10000);

test('Filter by furnished properties fails with error', async () => {
  fetchMock.get('/api/furnished-properties', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-furnished-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error filtering furnished properties.')).toBeInTheDocument();
}, 10000);

test('Filter by Property Status filters properties by status successfully', async () => {
  fetchMock.get('/api/properties?status=forsale', {
    status: 200,
    body: [{ id: 1, status: 'for sale' }]
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/status/i), { target: { value: 'forsale' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('for sale')).toBeInTheDocument();
}, 10000);

test('Filter by Property Status filters properties by status fails', async () => {
  fetchMock.get('/api/properties?status=forsale', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/status/i), { target: { value: 'forsale' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);
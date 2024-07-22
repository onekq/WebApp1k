import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import PropertySearch from './filterByPropertyStatus';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Filter by Property Status filters properties by status successfully', async () => {
  fetchMock.get('/api/properties?status=forsale', {
    status: 200,
    body: [{ id: 1, status: 'for sale' }]
  });

  await act(async () => render(<MemoryRouter><PropertySearch /></MemoryRouter>));
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

  await act(async () => render(<MemoryRouter><PropertySearch /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/status/i), { target: { value: 'forsale' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);


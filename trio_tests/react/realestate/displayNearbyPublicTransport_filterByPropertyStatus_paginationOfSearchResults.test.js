import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayNearbyPublicTransport_filterByPropertyStatus_paginationOfSearchResults';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('shows information about nearby public transportation', async () => {
  fetchMock.get('/property/1/transport', { body: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Transport')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('transportInfo')).toBeInTheDocument();
}, 10000);

test('fails to display nearby public transport due to network error', async () => {
  fetchMock.get('/property/1/transport', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Transport')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load nearby transport')).toBeInTheDocument();
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

test('splits search results across multiple pages', async () => {
  fetchMock.get('/properties?page=2', { body: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('nextPage')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('listingResult')).toBeInTheDocument();
}, 10000);

test('fails to paginate search results due to network error', async () => {
  fetchMock.get('/properties?page=2', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('nextPage')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load next page of results')).toBeInTheDocument();
}, 10000);

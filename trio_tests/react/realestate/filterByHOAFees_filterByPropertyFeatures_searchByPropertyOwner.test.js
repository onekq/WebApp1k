import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByHOAFees_filterByPropertyFeatures_searchByPropertyOwner';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Filter by HOA fees successfully', async () => {
  fetchMock.get('/api/hoa-fees-properties', { properties: [{ id: 1, fee: 100 }] });

  await act(async () => { render(<MemoryRouter><HOAFeesFilter /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('hoa-fees-input'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-by-hoa-fees-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('100')).toBeInTheDocument();
}, 10000);

test('Filter by HOA fees fails with error', async () => {
  fetchMock.get('/api/hoa-fees-properties', 500);

  await act(async () => { render(<MemoryRouter><HOAFeesFilter /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('hoa-fees-input'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-by-hoa-fees-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error filtering properties by HOA fees.')).toBeInTheDocument();
}, 10000);

test('Filter by Property Features filters properties by features successfully', async () => {
  fetchMock.get('/api/properties?features=balcony', {
    status: 200,
    body: [{ id: 1, features: ['balcony'] }]
  });

  await act(async () => render(<MemoryRouter><PropertySearch /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/features/i), { target: { value: 'balcony' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('balcony')).toBeInTheDocument();
}, 10000);

test('Filter by Property Features filters properties by features fails', async () => {
  fetchMock.get('/api/properties?features=balcony', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><PropertySearch /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/features/i), { target: { value: 'balcony' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);

test('Search by property owner successfully', async () => {
  fetchMock.get('/api/properties-by-owner', { properties: [{ id: 1, owner: "Owner 1" }] });

  await act(async () => { render(<MemoryRouter><PropertyOwnerSearch /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('owner-search-input'), { target: { value: 'Owner 1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-by-owner-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Owner 1')).toBeInTheDocument();
}, 10000);

test('Search by property owner fails with error', async () => {
  fetchMock.get('/api/properties-by-owner', 500);

  await act(async () => { render(<MemoryRouter><PropertyOwnerSearch /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('owner-search-input'), { target: { value: 'Owner 1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-by-owner-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error searching properties by owner.')).toBeInTheDocument();
}, 10000);

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import PropertyListing from './sortByPrice';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('sorts property listings by price in ascending order', async () => {
  fetchMock.get('/properties?sort=price', { body: [] });

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sortPrice'), { target: { value: 'asc' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitSort')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('listingResult')).toBeInTheDocument();
}, 10000);

test('fails to sort property listings by price due to network error', async () => {
  fetchMock.get('/properties?sort=price', 500);

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sortPrice'), { target: { value: 'asc' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitSort')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to sort properties by price')).toBeInTheDocument();
}, 10000);


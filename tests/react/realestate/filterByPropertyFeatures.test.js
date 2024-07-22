import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import PropertySearch from './filterByPropertyFeatures';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './searchByNumberOfBathrooms_searchByPropertyType';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Search by Number of Bathrooms filters properties by number of bathrooms successfully', async () => {
  fetchMock.get('/api/properties?bathrooms=2', {
    status: 200,
    body: [{ id: 1, bathrooms: 2 }]
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/bathrooms/i), { target: { value: '2' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('2 bathrooms')).toBeInTheDocument();
}, 10000);

test('Search by Number of Bathrooms filters properties by number of bathrooms fails', async () => {
  fetchMock.get('/api/properties?bathrooms=2', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/bathrooms/i), { target: { value: '2' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);

test('Search by Property Type filters properties by type successfully', async () => {
  fetchMock.get('/api/properties?type=apartment', {
    status: 200,
    body: [{ id: 1, type: 'apartment' }]
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/property type/i), { target: { value: 'apartment' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('apartment')).toBeInTheDocument();
}, 10000);

test('Search by Property Type filters properties by type fails', async () => {
  fetchMock.get('/api/properties?type=apartment', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/property type/i), { target: { value: 'apartment' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);
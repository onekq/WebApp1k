import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './searchByNumberOfBathrooms_searchByPropertyType_filterBySquareFootage_searchByLocation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Search by Number of Bathrooms filters properties by number of bathrooms successfully (from searchByNumberOfBathrooms_searchByPropertyType)', async () => {
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

test('Search by Number of Bathrooms filters properties by number of bathrooms fails (from searchByNumberOfBathrooms_searchByPropertyType)', async () => {
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

test('Search by Property Type filters properties by type successfully (from searchByNumberOfBathrooms_searchByPropertyType)', async () => {
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

test('Search by Property Type filters properties by type fails (from searchByNumberOfBathrooms_searchByPropertyType)', async () => {
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

test('Filter by Square Footage filters properties by their square footage successfully (from filterBySquareFootage_searchByLocation)', async () => {
  fetchMock.get('/api/properties?sqft=1000', {
    status: 200,
    body: [{ id: 1, sqft: 1000 }]
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/square footage/i), { target: { value: '1000' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('1000 sqft')).toBeInTheDocument();
}, 10000);

test('Filter by Square Footage filters properties by their square footage fails (from filterBySquareFootage_searchByLocation)', async () => {
  fetchMock.get('/api/properties?sqft=1000', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/square footage/i), { target: { value: '1000' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);

test('Search by Location filters properties by location successfully (from filterBySquareFootage_searchByLocation)', async () => {
  fetchMock.get('/api/properties?location=newyork', {
    status: 200,
    body: [{ id: 1, location: 'New York' }]
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'newyork' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('New York')).toBeInTheDocument();
}, 10000);

test('Search by Location filters properties by location fails (from filterBySquareFootage_searchByLocation)', async () => {
  fetchMock.get('/api/properties?location=newyork', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'newyork' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);


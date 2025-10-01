import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterBySquareFootage_filterByYearBuilt_paginationOfSearchResults';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Filter by Square Footage filters properties by their square footage successfully', async () => {
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

test('Filter by Square Footage filters properties by their square footage fails', async () => {
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

test('Filter by Year Built filters properties by the year they were built successfully', async () => {
  fetchMock.get('/api/properties?yearBuilt=2010', {
    status: 200,
    body: [{ id: 1, yearBuilt: 2010 }]
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/year built/i), { target: { value: '2010' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Built in 2010')).toBeInTheDocument();
}, 10000);

test('Filter by Year Built filters properties by the year they were built fails', async () => {
  fetchMock.get('/api/properties?yearBuilt=2010', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/year built/i), { target: { value: '2010' } }));
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

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculatePropertyValue_filterByOpenHouses_displayNearbySchools_paginationOfSearchResults';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully calculates property value. (from calculatePropertyValue_filterByOpenHouses)', async () => {
  fetchMock.post('/api/properties/value', { value: 500000 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('property-details'), { target: { value: 'Property Details' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-button')); });

  expect(fetchMock.calls('/api/properties/value').length).toEqual(1);
  expect(screen.getByText('$500,000')).toBeInTheDocument();
}, 10000);

test('Fails to calculate property value with error message. (from calculatePropertyValue_filterByOpenHouses)', async () => {
  fetchMock.post('/api/properties/value', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('property-details'), { target: { value: 'Property Details' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-button')); });

  expect(fetchMock.calls('/api/properties/value').length).toEqual(1);
  expect(screen.getByText('Failed to calculate value')).toBeInTheDocument();
}, 10000);

test('Filter by open houses successfully (from calculatePropertyValue_filterByOpenHouses)', async () => {
  fetchMock.get('/api/open-houses', { properties: [{ id: 1, name: "Open House 1" }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-open-houses-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Open House 1')).toBeInTheDocument();
}, 10000);

test('Filter by open houses fails with error (from calculatePropertyValue_filterByOpenHouses)', async () => {
  fetchMock.get('/api/open-houses', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-open-houses-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error filtering open houses.')).toBeInTheDocument();
}, 10000);

test('shows information about nearby schools for a property (from displayNearbySchools_paginationOfSearchResults)', async () => {
  fetchMock.get('/property/1/schools', { body: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Schools')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('schoolInfo')).toBeInTheDocument();
}, 10000);

test('fails to display nearby schools due to network error (from displayNearbySchools_paginationOfSearchResults)', async () => {
  fetchMock.get('/property/1/schools', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Schools')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load nearby schools')).toBeInTheDocument();
}, 10000);

test('splits search results across multiple pages (from displayNearbySchools_paginationOfSearchResults)', async () => {
  fetchMock.get('/properties?page=2', { body: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('nextPage')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('listingResult')).toBeInTheDocument();
}, 10000);

test('fails to paginate search results due to network error (from displayNearbySchools_paginationOfSearchResults)', async () => {
  fetchMock.get('/properties?page=2', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('nextPage')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load next page of results')).toBeInTheDocument();
}, 10000);


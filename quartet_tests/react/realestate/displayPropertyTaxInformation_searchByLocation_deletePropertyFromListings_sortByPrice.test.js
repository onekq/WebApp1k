import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayPropertyTaxInformation_searchByLocation_deletePropertyFromListings_sortByPrice';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('shows property tax details for a listing (from displayPropertyTaxInformation_searchByLocation)', async () => {
  fetchMock.get('/property/1/tax', { body: {} });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Tax')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('taxInfo')).toBeInTheDocument();
}, 10000);

test('fails to display property tax information due to network error (from displayPropertyTaxInformation_searchByLocation)', async () => {
  fetchMock.get('/property/1/tax', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Tax')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load property tax information')).toBeInTheDocument();
}, 10000);

test('Search by Location filters properties by location successfully (from displayPropertyTaxInformation_searchByLocation)', async () => {
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

test('Search by Location filters properties by location fails (from displayPropertyTaxInformation_searchByLocation)', async () => {
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

test('Successfully deletes a property from the listings. (from deletePropertyFromListings_sortByPrice)', async () => {
  fetchMock.delete('/api/properties/1', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/api/properties/1').length).toEqual(1);
  expect(screen.getByText('Property deleted successfully')).toBeInTheDocument();
}, 10000);

test('Fails to delete a property from the listings with error message. (from deletePropertyFromListings_sortByPrice)', async () => {
  fetchMock.delete('/api/properties/1', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/api/properties/1').length).toEqual(1);
  expect(screen.getByText('Failed to delete property')).toBeInTheDocument();
}, 10000);

test('sorts property listings by price in ascending order (from deletePropertyFromListings_sortByPrice)', async () => {
  fetchMock.get('/properties?sort=price', { body: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sortPrice'), { target: { value: 'asc' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitSort')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('listingResult')).toBeInTheDocument();
}, 10000);

test('fails to sort property listings by price due to network error (from deletePropertyFromListings_sortByPrice)', async () => {
  fetchMock.get('/properties?sort=price', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sortPrice'), { target: { value: 'asc' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitSort')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to sort properties by price')).toBeInTheDocument();
}, 10000);


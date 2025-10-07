import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayPropertyUtilitiesInformation_searchByLocation_deletePropertyFromListings_filterByFurnished';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully displays property utilities information. (from displayPropertyUtilitiesInformation_searchByLocation)', async () => {
  fetchMock.get('/api/properties/1/utilities', { data: 'Utilities Information' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-utilities-button')); });

  expect(fetchMock.calls('/api/properties/1/utilities').length).toEqual(1);
  expect(screen.getByText('Utilities Information')).toBeInTheDocument();
}, 10000);

test('Fails to display property utilities information with error message. (from displayPropertyUtilitiesInformation_searchByLocation)', async () => {
  fetchMock.get('/api/properties/1/utilities', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-utilities-button')); });

  expect(fetchMock.calls('/api/properties/1/utilities').length).toEqual(1);
  expect(screen.getByText('Failed to retrieve utilities information')).toBeInTheDocument();
}, 10000);

test('Search by Location filters properties by location successfully (from displayPropertyUtilitiesInformation_searchByLocation)', async () => {
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

test('Search by Location filters properties by location fails (from displayPropertyUtilitiesInformation_searchByLocation)', async () => {
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

test('Successfully deletes a property from the listings. (from deletePropertyFromListings_filterByFurnished)', async () => {
  fetchMock.delete('/api/properties/1', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/api/properties/1').length).toEqual(1);
  expect(screen.getByText('Property deleted successfully')).toBeInTheDocument();
}, 10000);

test('Fails to delete a property from the listings with error message. (from deletePropertyFromListings_filterByFurnished)', async () => {
  fetchMock.delete('/api/properties/1', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/api/properties/1').length).toEqual(1);
  expect(screen.getByText('Failed to delete property')).toBeInTheDocument();
}, 10000);

test('Filter by furnished properties successfully (from deletePropertyFromListings_filterByFurnished)', async () => {
  fetchMock.get('/api/furnished-properties', { properties: [{ id: 1, name: "Furnished 1" }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-furnished-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Furnished 1')).toBeInTheDocument();
}, 10000);

test('Filter by furnished properties fails with error (from deletePropertyFromListings_filterByFurnished)', async () => {
  fetchMock.get('/api/furnished-properties', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-furnished-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error filtering furnished properties.')).toBeInTheDocument();
}, 10000);


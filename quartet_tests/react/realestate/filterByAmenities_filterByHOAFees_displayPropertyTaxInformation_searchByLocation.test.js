import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByAmenities_filterByHOAFees_displayPropertyTaxInformation_searchByLocation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Filter by Amenities filters properties by amenities successfully (from filterByAmenities_filterByHOAFees)', async () => {
  fetchMock.get('/api/properties?amenities=pool', {
    status: 200,
    body: [{ id: 1, amenities: ['pool'] }]
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/amenities/i), { target: { value: 'pool' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('pool')).toBeInTheDocument();
}, 10000);

test('Filter by Amenities filters properties by amenities fails (from filterByAmenities_filterByHOAFees)', async () => {
  fetchMock.get('/api/properties?amenities=pool', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/amenities/i), { target: { value: 'pool' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);

test('Filter by HOA fees successfully (from filterByAmenities_filterByHOAFees)', async () => {
  fetchMock.get('/api/hoa-fees-properties', { properties: [{ id: 1, fee: 100 }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('hoa-fees-input'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-by-hoa-fees-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('100')).toBeInTheDocument();
}, 10000);

test('Filter by HOA fees fails with error (from filterByAmenities_filterByHOAFees)', async () => {
  fetchMock.get('/api/hoa-fees-properties', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('hoa-fees-input'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-by-hoa-fees-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error filtering properties by HOA fees.')).toBeInTheDocument();
}, 10000);

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


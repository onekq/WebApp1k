import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './mapIntegration_searchByPriceRange_viewPropertyDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('shows the property location on a map', async () => {
  fetchMock.get('/property/1/location', { body: {} });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Map')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('propertyMap')).toBeInTheDocument();
}, 10000);

test('fails to display property location on map due to network error', async () => {
  fetchMock.get('/property/1/location', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Map')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load property map')).toBeInTheDocument();
}, 10000);

test('Search by Price Range filters properties within a specified price range successfully', async () => {
  fetchMock.get('/api/properties?minPrice=50000&maxPrice=200000', {
    status: 200,
    body: [{ id: 1, price: 100000 }]
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/min price/i), { target: { value: '50000' } }));
  await act(async () => fireEvent.change(screen.getByLabelText(/max price/i), { target: { value: '200000' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('100000')).toBeInTheDocument();
}, 10000);

test('Search by Price Range filters properties within a specified price range fails', async () => {
  fetchMock.get('/api/properties?minPrice=50000&maxPrice=200000', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/min price/i), { target: { value: '50000' } }));
  await act(async () => fireEvent.change(screen.getByLabelText(/max price/i), { target: { value: '200000' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);

test('displays detailed information about a property', async () => {
  fetchMock.get('/property/1', { body: {} });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('propertyDetail')).toBeInTheDocument();
}, 10000);

test('fails to display property details due to network error', async () => {
  fetchMock.get('/property/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load property details')).toBeInTheDocument();
}, 10000);

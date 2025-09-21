import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './mapIntegration_saveFavoriteProperties_searchByNumberOfBedrooms';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('shows the property location on a map', async () => {
  fetchMock.get('/property/1/location', { body: {} });

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Map')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('propertyMap')).toBeInTheDocument();
}, 10000);

test('fails to display property location on map due to network error', async () => {
  fetchMock.get('/property/1/location', 500);

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Map')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load property map')).toBeInTheDocument();
}, 10000);

test('successfully saves favorite properties', async () => {
  fetchMock.post('/api/favorites', 200);

  await act(async () => { render(<MemoryRouter><SaveFavoriteProperties /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-favorite-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('favorite-confirmation')).toBeInTheDocument();
}, 10000);

test('fails to save favorite properties and shows error message', async () => {
  fetchMock.post('/api/favorites', 500);

  await act(async () => { render(<MemoryRouter><SaveFavoriteProperties /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-favorite-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('favorite-error')).toBeInTheDocument();
}, 10000);

test('Search by Number of Bedrooms filters properties by number of bedrooms successfully', async () => {
  fetchMock.get('/api/properties?bedrooms=2', {
    status: 200,
    body: [{ id: 1, bedrooms: 2 }]
  });

  await act(async () => render(<MemoryRouter><PropertySearch /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/bedrooms/i), { target: { value: '2' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('2 bedrooms')).toBeInTheDocument();
}, 10000);

test('Search by Number of Bedrooms filters properties by number of bedrooms fails', async () => {
  fetchMock.get('/api/properties?bedrooms=2', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><PropertySearch /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/bedrooms/i), { target: { value: '2' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);

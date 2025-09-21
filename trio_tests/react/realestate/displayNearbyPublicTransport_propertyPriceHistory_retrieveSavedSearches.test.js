import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayNearbyPublicTransport_propertyPriceHistory_retrieveSavedSearches';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('shows information about nearby public transportation', async () => {
  fetchMock.get('/property/1/transport', { body: [] });

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Transport')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('transportInfo')).toBeInTheDocument();
}, 10000);

test('fails to display nearby public transport due to network error', async () => {
  fetchMock.get('/property/1/transport', 500);

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Transport')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load nearby transport')).toBeInTheDocument();
}, 10000);

test('Successfully displays property price history.', async () => {
  fetchMock.get('/api/properties/1/price-history', { history: ['Price Data'] });

  await act(async () => { render(<MemoryRouter><PropertyPriceHistory /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-history-button')); });

  expect(fetchMock.calls('/api/properties/1/price-history').length).toEqual(1);
  expect(screen.getByText('Price Data')).toBeInTheDocument();
}, 10000);

test('Fails to display property price history with error message.', async () => {
  fetchMock.get('/api/properties/1/price-history', 400);

  await act(async () => { render(<MemoryRouter><PropertyPriceHistory /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-history-button')); });

  expect(fetchMock.calls('/api/properties/1/price-history').length).toEqual(1);
  expect(screen.getByText('Failed to retrieve price history')).toBeInTheDocument();
}, 10000);

test('successfully retrieves saved searches', async () => {
  fetchMock.get('/api/search/list', 200);

  await act(async () => { render(<MemoryRouter><RetrieveSavedSearches /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('retrieve-searches-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('retrieved-searches')).toBeInTheDocument();
}, 10000);

test('fails to retrieve saved searches and shows error message', async () => {
  fetchMock.get('/api/search/list', 500);

  await act(async () => { render(<MemoryRouter><RetrieveSavedSearches /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('retrieve-searches-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('retrieve-error')).toBeInTheDocument();
}, 10000);

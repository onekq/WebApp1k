import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './propertyPriceHistory_removeFavoriteProperties_contactPropertyOwner_filterByOpenHouses';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully displays property price history. (from propertyPriceHistory_removeFavoriteProperties)', async () => {
  fetchMock.get('/api/properties/1/price-history', { history: ['Price Data'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-history-button')); });

  expect(fetchMock.calls('/api/properties/1/price-history').length).toEqual(1);
  expect(screen.getByText('Price Data')).toBeInTheDocument();
}, 10000);

test('Fails to display property price history with error message. (from propertyPriceHistory_removeFavoriteProperties)', async () => {
  fetchMock.get('/api/properties/1/price-history', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-history-button')); });

  expect(fetchMock.calls('/api/properties/1/price-history').length).toEqual(1);
  expect(screen.getByText('Failed to retrieve price history')).toBeInTheDocument();
}, 10000);

test('successfully removes favorite properties (from propertyPriceHistory_removeFavoriteProperties)', async () => {
  fetchMock.post('/api/favorites/remove', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-favorite-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('remove-confirmation')).toBeInTheDocument();
}, 10000);

test('fails to remove favorite properties and shows error message (from propertyPriceHistory_removeFavoriteProperties)', async () => {
  fetchMock.post('/api/favorites/remove', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-favorite-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('remove-error')).toBeInTheDocument();
}, 10000);

test('successfully contacts property owner (from contactPropertyOwner_filterByOpenHouses)', async () => {
  fetchMock.post('/api/contact', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('contact-message'), { target: { value: 'Hello' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('contact-submit-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('contact-success')).toBeInTheDocument();
}, 10000);

test('fails to contact property owner and shows error message (from contactPropertyOwner_filterByOpenHouses)', async () => {
  fetchMock.post('/api/contact', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('contact-message'), { target: { value: 'Hello' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('contact-submit-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('contact-error')).toBeInTheDocument();
}, 10000);

test('Filter by open houses successfully (from contactPropertyOwner_filterByOpenHouses)', async () => {
  fetchMock.get('/api/open-houses', { properties: [{ id: 1, name: "Open House 1" }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-open-houses-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Open House 1')).toBeInTheDocument();
}, 10000);

test('Filter by open houses fails with error (from contactPropertyOwner_filterByOpenHouses)', async () => {
  fetchMock.get('/api/open-houses', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-open-houses-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error filtering open houses.')).toBeInTheDocument();
}, 10000);


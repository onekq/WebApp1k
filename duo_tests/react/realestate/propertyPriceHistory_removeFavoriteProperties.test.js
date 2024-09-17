import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './propertyPriceHistory_removeFavoriteProperties';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully displays property price history.', async () => {
  fetchMock.get('/api/properties/1/price-history', { history: ['Price Data'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-history-button')); });

  expect(fetchMock.calls('/api/properties/1/price-history').length).toEqual(1);
  expect(screen.getByText('Price Data')).toBeInTheDocument();
}, 10000);

test('Fails to display property price history with error message.', async () => {
  fetchMock.get('/api/properties/1/price-history', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-history-button')); });

  expect(fetchMock.calls('/api/properties/1/price-history').length).toEqual(1);
  expect(screen.getByText('Failed to retrieve price history')).toBeInTheDocument();
}, 10000);

test('successfully removes favorite properties', async () => {
  fetchMock.post('/api/favorites/remove', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-favorite-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('remove-confirmation')).toBeInTheDocument();
}, 10000);

test('fails to remove favorite properties and shows error message', async () => {
  fetchMock.post('/api/favorites/remove', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-favorite-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('remove-error')).toBeInTheDocument();
}, 10000);
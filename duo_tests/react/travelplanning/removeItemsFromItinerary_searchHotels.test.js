import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './removeItemsFromItinerary_searchHotels';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully removes items from an itinerary.', async () => {
  fetchMock.delete('/api/remove-item', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-item-button')); });

  expect(fetchMock.calls('/api/remove-item', 'DELETE')).toHaveLength(1);
  expect(screen.queryByTestId('item1')).not.toBeInTheDocument();
}, 10000);

test('fails to remove items due to network error.', async () => {
  fetchMock.delete('/api/remove-item', { status: 500, body: { error: 'Network error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-item-button')); });

  expect(fetchMock.calls('/api/remove-item', 'DELETE')).toHaveLength(1);
  expect(screen.getByText('Network error')).toBeInTheDocument();
}, 10000);

test('searchHotels - should display hotel search results on successful search', async () => {
  fetchMock.get('/api/hotels?destination=Paris&dates=2023-01-01_to_2023-01-10&guests=2', {
    body: [{ id: 1, name: 'Hotel Paris' }],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('destination-input'), { target: { value: 'Paris' } });
    fireEvent.click(screen.getByTestId('search-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Hotel Paris')).toBeInTheDocument();
}, 10000);

test('searchHotels - should display an error message on search failure', async () => {
  fetchMock.get('/api/hotels?destination=Paris&dates=2023-01-01_to_2023-01-10&guests=2', {
    body: { message: 'Network Error' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('destination-input'), { target: { value: 'Paris' } });
    fireEvent.click(screen.getByTestId('search-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);
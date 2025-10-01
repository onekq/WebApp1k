import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './receivePropertyAlerts_searchByPriceRange_sharePropertyListings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully receives property alerts', async () => {
  fetchMock.get('/api/alerts', 200);

  await act(async () => { render(<MemoryRouter><ReceivePropertyAlerts /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('receive-alerts-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('alerts-list')).toBeInTheDocument();
}, 10000);

test('fails to receive property alerts and shows error message', async () => {
  fetchMock.get('/api/alerts', 500);

  await act(async () => { render(<MemoryRouter><ReceivePropertyAlerts /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('receive-alerts-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('alerts-error')).toBeInTheDocument();
}, 10000);

test('Search by Price Range filters properties within a specified price range successfully', async () => {
  fetchMock.get('/api/properties?minPrice=50000&maxPrice=200000', {
    status: 200,
    body: [{ id: 1, price: 100000 }]
  });

  await act(async () => render(<MemoryRouter><PropertySearch /></MemoryRouter>));
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

  await act(async () => render(<MemoryRouter><PropertySearch /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/min price/i), { target: { value: '50000' } }));
  await act(async () => fireEvent.change(screen.getByLabelText(/max price/i), { target: { value: '200000' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);

test('successfully shares property listings', async () => {
  fetchMock.post('/api/share', 200);

  await act(async () => { render(<MemoryRouter><SharePropertyListings /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-listing-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('share-success')).toBeInTheDocument();
}, 10000);

test('fails to share property listings and shows error message', async () => {
  fetchMock.post('/api/share', 500);

  await act(async () => { render(<MemoryRouter><SharePropertyListings /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-listing-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('share-error')).toBeInTheDocument();
}, 10000);

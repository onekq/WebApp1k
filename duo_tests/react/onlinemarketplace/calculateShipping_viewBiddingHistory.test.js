import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateShipping_viewBiddingHistory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('correctly calculates shipping based on location.', async () => {
  fetchMock.post('/api/shipping', { body: { cost: 15 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('location-input'), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Shipping')); });

  expect(fetchMock.calls('/api/shipping').length).toEqual(1);
  expect(screen.getByText('Shipping cost: $15')).toBeInTheDocument();
}, 10000);

test('displays error on failing to calculate shipping.', async () => {
  fetchMock.post('/api/shipping', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('location-input'), { target: { value: '54321' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Shipping')); });

  expect(fetchMock.calls('/api/shipping').length).toEqual(1);
  expect(screen.getByText('Failed to calculate shipping')).toBeInTheDocument();
}, 10000);

test('successfully views bidding history', async () => {
  const mockHistory = [
    { id: 1, item: 'Item 1', bid: 100 },
    { id: 2, item: 'Item 2', bid: 200 },
  ];
  
  fetchMock.get('/api/bidding-history', { status: 200, body: mockHistory });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-history-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  mockHistory.forEach(({ item, bid }) => {
    expect(screen.getByText(item)).toBeInTheDocument();
    expect(screen.getByText(`$${bid}`)).toBeInTheDocument();
  });
}, 10000);

test('fails to view bidding history with an error message displayed.', async () => {
  fetchMock.get('/api/bidding-history', { status: 400, body: { error: 'Failed to load history' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-history-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load history')).toBeInTheDocument();
}, 10000);
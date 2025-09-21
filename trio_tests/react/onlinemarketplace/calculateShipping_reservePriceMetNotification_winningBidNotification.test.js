import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateShipping_reservePriceMetNotification_winningBidNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('correctly calculates shipping based on location.', async () => {
  fetchMock.post('/api/shipping', { body: { cost: 15 } });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('location-input'), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Shipping')); });

  expect(fetchMock.calls('/api/shipping').length).toEqual(1);
  expect(screen.getByText('Shipping cost: $15')).toBeInTheDocument();
}, 10000);

test('displays error on failing to calculate shipping.', async () => {
  fetchMock.post('/api/shipping', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('location-input'), { target: { value: '54321' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Shipping')); });

  expect(fetchMock.calls('/api/shipping').length).toEqual(1);
  expect(screen.getByText('Failed to calculate shipping')).toBeInTheDocument();
}, 10000);

test('successfully notifies user when reserve price is met.', async () => {
  fetchMock.get('/api/reserve-price', { status: 200, body: { message: 'Reserve price met' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-reserve-price')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Reserve price met')).toBeInTheDocument();
}, 10000);

test('fails to notify user when reserve price is not met.', async () => {
  fetchMock.get('/api/reserve-price', { status: 400, body: { error: 'Reserve price not met' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-reserve-price')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Reserve price not met')).toBeInTheDocument();
}, 10000);

test('successfully notifies user of winning bid.', async () => {
  fetchMock.get('/api/winning-bid', { status: 200, body: { message: 'You have won the bid!' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-winning-bid')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('You have won the bid!')).toBeInTheDocument();
}, 10000);

test('fails to notify user of winning bid with an error message.', async () => {
  fetchMock.get('/api/winning-bid', { status: 400, body: { error: 'No winning bid' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-winning-bid')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No winning bid')).toBeInTheDocument();
}, 10000);

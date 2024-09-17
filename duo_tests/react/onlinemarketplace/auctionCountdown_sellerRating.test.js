import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './auctionCountdown_sellerRating';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('displays the auction countdown successfully.', async () => {
  const mockTimerData = { time: '10:00:00' };
  fetchMock.get('/api/auction-timer', { status: 200, body: mockTimerData });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('auction-timer-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('10:00:00')).toBeInTheDocument();
}, 10000);

test('fails to display the auction countdown with an error message.', async () => {
  fetchMock.get('/api/auction-timer', { status: 400, body: { error: 'Failed to load timer' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('auction-timer-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load timer')).toBeInTheDocument();
}, 10000);

test('successfully rates a seller with a success message.', async () => {
  fetchMock.post('/api/rate-seller', { status: 200, body: { message: 'Seller rated successfully' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rating-input'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rate-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Seller rated successfully')).toBeInTheDocument();
}, 10000);

test('fails to rate a seller with an error message.', async () => {
  fetchMock.post('/api/rate-seller', { status: 400, body: { error: 'Failed to rate seller' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rating-input'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rate-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to rate seller')).toBeInTheDocument();
}, 10000);
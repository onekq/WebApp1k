import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applyDiscountCode_auctionCountdown';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('applies discount code successfully.', async () => {
  fetchMock.post('/api/discount', { body: { discount: 10 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discount-code-input'), { target: { value: 'DISCOUNT10' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Discount')); });

  expect(fetchMock.calls('/api/discount').length).toEqual(1);
  expect(screen.getByText('Discount applied: 10%')).toBeInTheDocument();
}, 10000);

test('displays error on invalid discount code.', async () => {
  fetchMock.post('/api/discount', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discount-code-input'), { target: { value: 'INVALIDCODE' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Discount')); });

  expect(fetchMock.calls('/api/discount').length).toEqual(1);
  expect(screen.getByText('Invalid discount code')).toBeInTheDocument();
}, 10000);

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
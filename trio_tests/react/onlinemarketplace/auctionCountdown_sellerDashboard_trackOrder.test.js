import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './auctionCountdown_sellerDashboard_trackOrder';

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

test('successfully displays the seller dashboard.', async () => {
  const mockDashboardData = { 
    dashboardInfo: 'Some dashboard information' 
  };
  fetchMock.get('/api/seller-dashboard', { status: 200, body: mockDashboardData });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('dashboard-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Some dashboard information')).toBeInTheDocument();
}, 10000);

test('fails to display the seller dashboard with an error message.', async () => {
  fetchMock.get('/api/seller-dashboard', { status: 400, body: { error: 'Failed to load dashboard' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('dashboard-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load dashboard')).toBeInTheDocument();
}, 10000);

test('Track Order success displays tracking information', async () => {
  fetchMock.get('/api/orders/1/track', { status: 'In Transit' });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Track Order')); });

  expect(fetchMock.calls('/api/orders/1/track').length).toBe(1);
  expect(screen.getByText('In Transit')).toBeInTheDocument();
}, 10000);

test('Track Order failure shows error message', async () => {
  fetchMock.get('/api/orders/1/track', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Track Order')); });

  expect(screen.getByText('Error tracking order')).toBeInTheDocument();
}, 10000);

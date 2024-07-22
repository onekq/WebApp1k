import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './sellerDashboard';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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


import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './calculateItineraryCost';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully calculates the total cost of the itinerary.', async () => {
  fetchMock.get('/api/calculate-cost', { status: 200, body: { totalCost: 1000 } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-cost-button')); });

  expect(fetchMock.calls('/api/calculate-cost', 'GET')).toHaveLength(1);
  expect(screen.getByText('$1000')).toBeInTheDocument();
}, 10000);

test('fails to calculate cost due to server error.', async () => {
  fetchMock.get('/api/calculate-cost', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-cost-button')); });

  expect(fetchMock.calls('/api/calculate-cost', 'GET')).toHaveLength(1);
  expect(screen.getByText('Server error')).toBeInTheDocument();
}, 10000);


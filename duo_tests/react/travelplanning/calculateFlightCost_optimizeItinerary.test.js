import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateFlightCost_optimizeItinerary';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('CalculateFlightCost - calculate total flight cost successfully', async () => {
  fetchMock.post('/api/calculate-cost', { cost: 250 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Ticket Price'), { target: { value: '200' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Cost')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total Cost: 250')).toBeInTheDocument();
}, 10000);

test('CalculateFlightCost - calculate total flight cost fails with error message', async () => {
  fetchMock.post('/api/calculate-cost', { throws: new Error('Failed to calculate flight cost') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Ticket Price'), { target: { value: '200' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Cost')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to calculate flight cost')).toBeInTheDocument();
}, 10000);

test('successfully optimizes itinerary for travel time and convenience.', async () => {
  fetchMock.post('/api/optimize-itinerary', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('optimize-itinerary-button')); });

  expect(fetchMock.calls('/api/optimize-itinerary', 'POST')).toHaveLength(1);
  expect(screen.getByText('Itinerary optimized')).toBeInTheDocument();
}, 10000);

test('fails to optimize itinerary due to server error.', async () => {
  fetchMock.post('/api/optimize-itinerary', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('optimize-itinerary-button')); });

  expect(fetchMock.calls('/api/optimize-itinerary', 'POST')).toHaveLength(1);
  expect(screen.getByText('Server error')).toBeInTheDocument();
}, 10000);
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applyLoyaltyPoints_calculateFlightCost_sortFlights';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Loyalty points should be calculated and applied for valid bookings.', async () => {
  fetchMock.post('/api/loyalty', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-loyalty')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('loyalty-success')).toBeInTheDocument();
}, 10000);

test('Error in applying loyalty points should show error message.', async () => {
  fetchMock.post('/api/loyalty', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-loyalty')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('loyalty-error')).toBeInTheDocument();
}, 10000);

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

test('SortFlights - sort flights by price successfully', async () => {
  fetchMock.get('/api/flights?sort=price', {
    flights: [{ id: 1, airline: 'Delta', price: 200, duration: '5h' }]
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Sort By'), { target: { value: 'price' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Sort')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Delta')).toBeInTheDocument();
}, 10000);

test('SortFlights - sort flights by price fails with error message', async () => {
  fetchMock.get('/api/flights?sort=price', { throws: new Error('Failed to sort flights') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Sort By'), { target: { value: 'price' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Sort')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort flights')).toBeInTheDocument();
}, 10000);

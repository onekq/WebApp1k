import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addCustomEvents_filterFlights';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds custom events to an itinerary.', async () => {
  fetchMock.post('/api/add-event', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('event-input'), { target: { value: 'Event1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-event-button')); });

  expect(fetchMock.calls('/api/add-event', 'POST')).toHaveLength(1);
  expect(screen.getByTestId('event1')).toBeInTheDocument();
}, 10000);

test('fails to add custom events due to network error.', async () => {
  fetchMock.post('/api/add-event', { status: 500, body: { error: 'Network error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('event-input'), { target: { value: 'Event1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-event-button')); });

  expect(fetchMock.calls('/api/add-event', 'POST')).toHaveLength(1);
  expect(screen.getByText('Network error')).toBeInTheDocument();
}, 10000);

test('FilterFlights - filter flights by price successfully', async () => {
  fetchMock.get('/api/flights?filter=price', {
    flights: [{ id: 1, airline: 'Delta', price: 200, duration: '5h' }]
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Sort By'), { target: { value: 'price' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Delta')).toBeInTheDocument();
}, 10000);

test('FilterFlights - filter flights by price fails with error message', async () => {
  fetchMock.get('/api/flights?filter=price', { throws: new Error('Failed to filter flights') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Sort By'), { target: { value: 'price' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter flights')).toBeInTheDocument();
}, 10000);
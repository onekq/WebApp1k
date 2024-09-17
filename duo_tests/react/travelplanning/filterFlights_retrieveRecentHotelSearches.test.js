import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterFlights_retrieveRecentHotelSearches';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('retrieveRecentHotelSearches - retrieves recent hotel searches successfully', async () => {
  fetchMock.get('/api/hotels/recent', {
    body: [{ id: 4, name: 'Recent Hotel' }],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('retrieve-recent-searches'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recent Hotel')).toBeInTheDocument();
}, 10000);

test('retrieveRecentHotelSearches - shows error message when retrieval fails', async () => {
  fetchMock.get('/api/hotels/recent', {
    body: { message: 'Retrieval Error' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('retrieve-recent-searches'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Retrieval Error')).toBeInTheDocument();
}, 10000);
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateMortgagePayments_searchByLocation_viewOpenHouseSchedule';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Calculate mortgage payments successfully', async () => {
  fetchMock.post('/api/mortgage-calc', { estimatedPayment: 1200 });

  await act(async () => { render(<MemoryRouter><CalculateMortgage /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('price-input'), { target: { value: '300000' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('estimate')).toBeInTheDocument();
}, 10000);

test('Calculate mortgage payments fails with error', async () => {
  fetchMock.post('/api/mortgage-calc', 500);

  await act(async () => { render(<MemoryRouter><CalculateMortgage /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('price-input'), { target: { value: '300000' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error calculating mortgage.')).toBeInTheDocument();
}, 10000);

test('Search by Location filters properties by location successfully', async () => {
  fetchMock.get('/api/properties?location=newyork', {
    status: 200,
    body: [{ id: 1, location: 'New York' }]
  });

  await act(async () => render(<MemoryRouter><PropertySearch /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'newyork' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('New York')).toBeInTheDocument();
}, 10000);

test('Search by Location filters properties by location fails', async () => {
  fetchMock.get('/api/properties?location=newyork', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><PropertySearch /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'newyork' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);

test('View open house schedule successfully', async () => {
  fetchMock.get('/api/open-house-schedule', { schedule: 'Sun 2-4 PM' });

  await act(async () => { render(<MemoryRouter><OpenHouseSchedule /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-schedule-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Sun 2-4 PM')).toBeInTheDocument();
}, 10000);

test('View open house schedule fails with error', async () => {
  fetchMock.get('/api/open-house-schedule', 500);

  await act(async () => { render(<MemoryRouter><OpenHouseSchedule /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-schedule-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error fetching open house schedule.')).toBeInTheDocument();
}, 10000);

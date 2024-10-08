import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateMortgagePayments_searchByPropertyType';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Calculate mortgage payments successfully', async () => {
  fetchMock.post('/api/mortgage-calc', { estimatedPayment: 1200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('price-input'), { target: { value: '300000' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('estimate')).toBeInTheDocument();
}, 10000);

test('Calculate mortgage payments fails with error', async () => {
  fetchMock.post('/api/mortgage-calc', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('price-input'), { target: { value: '300000' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error calculating mortgage.')).toBeInTheDocument();
}, 10000);

test('Search by Property Type filters properties by type successfully', async () => {
  fetchMock.get('/api/properties?type=apartment', {
    status: 200,
    body: [{ id: 1, type: 'apartment' }]
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/property type/i), { target: { value: 'apartment' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('apartment')).toBeInTheDocument();
}, 10000);

test('Search by Property Type filters properties by type fails', async () => {
  fetchMock.get('/api/properties?type=apartment', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/property type/i), { target: { value: 'apartment' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);
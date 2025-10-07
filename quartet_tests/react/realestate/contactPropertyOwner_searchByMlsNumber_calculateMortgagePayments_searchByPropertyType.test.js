import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contactPropertyOwner_searchByMlsNumber_calculateMortgagePayments_searchByPropertyType';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully contacts property owner (from contactPropertyOwner_searchByMlsNumber)', async () => {
  fetchMock.post('/api/contact', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('contact-message'), { target: { value: 'Hello' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('contact-submit-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('contact-success')).toBeInTheDocument();
}, 10000);

test('fails to contact property owner and shows error message (from contactPropertyOwner_searchByMlsNumber)', async () => {
  fetchMock.post('/api/contact', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('contact-message'), { target: { value: 'Hello' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('contact-submit-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('contact-error')).toBeInTheDocument();
}, 10000);

test('Successfully searches by MLS number. (from contactPropertyOwner_searchByMlsNumber)', async () => {
  fetchMock.get('/api/properties?mls=12345', { data: { property: 'Property Data' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('mls-input'), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls('/api/properties?mls=12345').length).toEqual(1);
  expect(screen.getByText('Property Data')).toBeInTheDocument();
}, 10000);

test('Fails to search by MLS number with error message. (from contactPropertyOwner_searchByMlsNumber)', async () => {
  fetchMock.get('/api/properties?mls=12345', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('mls-input'), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls('/api/properties?mls=12345').length).toEqual(1);
  expect(screen.getByText('Failed to retrieve property')).toBeInTheDocument();
}, 10000);

test('Calculate mortgage payments successfully (from calculateMortgagePayments_searchByPropertyType)', async () => {
  fetchMock.post('/api/mortgage-calc', { estimatedPayment: 1200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('price-input'), { target: { value: '300000' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('estimate')).toBeInTheDocument();
}, 10000);

test('Calculate mortgage payments fails with error (from calculateMortgagePayments_searchByPropertyType)', async () => {
  fetchMock.post('/api/mortgage-calc', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('price-input'), { target: { value: '300000' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error calculating mortgage.')).toBeInTheDocument();
}, 10000);

test('Search by Property Type filters properties by type successfully (from calculateMortgagePayments_searchByPropertyType)', async () => {
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

test('Search by Property Type filters properties by type fails (from calculateMortgagePayments_searchByPropertyType)', async () => {
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


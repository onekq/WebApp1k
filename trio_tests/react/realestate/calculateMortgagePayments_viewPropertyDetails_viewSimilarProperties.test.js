import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateMortgagePayments_viewPropertyDetails_viewSimilarProperties';

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

test('displays detailed information about a property', async () => {
  fetchMock.get('/property/1', { body: {} });

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('propertyDetail')).toBeInTheDocument();
}, 10000);

test('fails to display property details due to network error', async () => {
  fetchMock.get('/property/1', 500);

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load property details')).toBeInTheDocument();
}, 10000);

test('View similar properties successfully', async () => {
  fetchMock.get('/api/similar-properties', { properties: [{ id: 1, name: "Prop 1" }] });

  await act(async () => { render(<MemoryRouter><SimilarProperties /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-similar-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Prop 1')).toBeInTheDocument();
}, 10000);

test('View similar properties fails with error', async () => {
  fetchMock.get('/api/similar-properties', 500);

  await act(async () => { render(<MemoryRouter><SimilarProperties /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-similar-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error loading similar properties.')).toBeInTheDocument();
}, 10000);

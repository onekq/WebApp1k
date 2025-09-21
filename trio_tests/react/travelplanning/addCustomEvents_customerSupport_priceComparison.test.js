import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addCustomEvents_customerSupport_priceComparison';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully adds custom events to an itinerary.', async () => {
  fetchMock.post('/api/add-event', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('event-input'), { target: { value: 'Event1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-event-button')); });

  expect(fetchMock.calls('/api/add-event', 'POST')).toHaveLength(1);
  expect(screen.getByTestId('event1')).toBeInTheDocument();
}, 10000);

test('fails to add custom events due to network error.', async () => {
  fetchMock.post('/api/add-event', { status: 500, body: { error: 'Network error' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('event-input'), { target: { value: 'Event1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-event-button')); });

  expect(fetchMock.calls('/api/add-event', 'POST')).toHaveLength(1);
  expect(screen.getByText('Network error')).toBeInTheDocument();
}, 10000);

test('Customer support options should be provided successfully.', async () => {
  fetchMock.get('/api/support/options', [{ id: 1, method: 'Phone' }]);

  await act(async () => { render(<MemoryRouter><CustomerSupportComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('get-support-options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('support-options')).toBeInTheDocument();
}, 10000);

test('Error in offering customer support should show error message.', async () => {
  fetchMock.get('/api/support/options', 500);

  await act(async () => { render(<MemoryRouter><CustomerSupportComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('get-support-options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('support-error')).toBeInTheDocument();
}, 10000);

test('Price comparison should be provided for valid search.', async () => {
  fetchMock.post('/api/price/comparison', { price: 100 });

  await act(async () => { render(<MemoryRouter><PriceComparisonComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('compare-prices')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('price-comparison')).toBeInTheDocument();
}, 10000);

test('Error in providing price comparison should show error message.', async () => {
  fetchMock.post('/api/price/comparison', 500);

  await act(async () => { render(<MemoryRouter><PriceComparisonComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('compare-prices')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('comparison-error')).toBeInTheDocument();
}, 10000);

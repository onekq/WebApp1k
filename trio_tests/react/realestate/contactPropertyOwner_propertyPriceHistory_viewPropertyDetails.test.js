import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contactPropertyOwner_propertyPriceHistory_viewPropertyDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully contacts property owner', async () => {
  fetchMock.post('/api/contact', 200);

  await act(async () => { render(<MemoryRouter><ContactPropertyOwner /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('contact-message'), { target: { value: 'Hello' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('contact-submit-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('contact-success')).toBeInTheDocument();
}, 10000);

test('fails to contact property owner and shows error message', async () => {
  fetchMock.post('/api/contact', 500);

  await act(async () => { render(<MemoryRouter><ContactPropertyOwner /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('contact-message'), { target: { value: 'Hello' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('contact-submit-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('contact-error')).toBeInTheDocument();
}, 10000);

test('Successfully displays property price history.', async () => {
  fetchMock.get('/api/properties/1/price-history', { history: ['Price Data'] });

  await act(async () => { render(<MemoryRouter><PropertyPriceHistory /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-history-button')); });

  expect(fetchMock.calls('/api/properties/1/price-history').length).toEqual(1);
  expect(screen.getByText('Price Data')).toBeInTheDocument();
}, 10000);

test('Fails to display property price history with error message.', async () => {
  fetchMock.get('/api/properties/1/price-history', 400);

  await act(async () => { render(<MemoryRouter><PropertyPriceHistory /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-history-button')); });

  expect(fetchMock.calls('/api/properties/1/price-history').length).toEqual(1);
  expect(screen.getByText('Failed to retrieve price history')).toBeInTheDocument();
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

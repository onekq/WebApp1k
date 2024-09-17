import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculatePropertyValue_searchByPropertyOwner';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully calculates property value.', async () => {
  fetchMock.post('/api/properties/value', { value: 500000 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('property-details'), { target: { value: 'Property Details' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-button')); });

  expect(fetchMock.calls('/api/properties/value').length).toEqual(1);
  expect(screen.getByText('$500,000')).toBeInTheDocument();
}, 10000);

test('Fails to calculate property value with error message.', async () => {
  fetchMock.post('/api/properties/value', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('property-details'), { target: { value: 'Property Details' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-button')); });

  expect(fetchMock.calls('/api/properties/value').length).toEqual(1);
  expect(screen.getByText('Failed to calculate value')).toBeInTheDocument();
}, 10000);

test('Search by property owner successfully', async () => {
  fetchMock.get('/api/properties-by-owner', { properties: [{ id: 1, owner: "Owner 1" }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('owner-search-input'), { target: { value: 'Owner 1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-by-owner-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Owner 1')).toBeInTheDocument();
}, 10000);

test('Search by property owner fails with error', async () => {
  fetchMock.get('/api/properties-by-owner', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('owner-search-input'), { target: { value: 'Owner 1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-by-owner-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error searching properties by owner.')).toBeInTheDocument();
}, 10000);
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './compareProperties_filterByPetFriendly_sortByPrice';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully compares properties', async () => {
  fetchMock.post('/api/properties/compare', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('compare-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('comparison-result')).toBeInTheDocument();
}, 10000);

test('fails to compare properties and shows error message', async () => {
  fetchMock.post('/api/properties/compare', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('compare-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('comparison-error')).toBeInTheDocument();
}, 10000);

test('Filter by pet-friendly properties successfully', async () => {
  fetchMock.get('/api/pet-friendly-properties', { properties: [{ id: 1, name: "Pet-Friendly 1" }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-pet-friendly-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Pet-Friendly 1')).toBeInTheDocument();
}, 10000);

test('Filter by pet-friendly properties fails with error', async () => {
  fetchMock.get('/api/pet-friendly-properties', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-pet-friendly-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error filtering pet-friendly properties.')).toBeInTheDocument();
}, 10000);

test('sorts property listings by price in ascending order', async () => {
  fetchMock.get('/properties?sort=price', { body: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sortPrice'), { target: { value: 'asc' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitSort')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('listingResult')).toBeInTheDocument();
}, 10000);

test('fails to sort property listings by price due to network error', async () => {
  fetchMock.get('/properties?sort=price', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sortPrice'), { target: { value: 'asc' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitSort')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to sort properties by price')).toBeInTheDocument();
}, 10000);

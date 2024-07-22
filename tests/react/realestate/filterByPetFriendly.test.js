import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import PetFriendlyFilter from './filterByPetFriendly';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Filter by pet-friendly properties successfully', async () => {
  fetchMock.get('/api/pet-friendly-properties', { properties: [{ id: 1, name: "Pet-Friendly 1" }] });

  await act(async () => { render(<MemoryRouter><PetFriendlyFilter /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-pet-friendly-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Pet-Friendly 1')).toBeInTheDocument();
}, 10000);

test('Filter by pet-friendly properties fails with error', async () => {
  fetchMock.get('/api/pet-friendly-properties', 500);

  await act(async () => { render(<MemoryRouter><PetFriendlyFilter /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-pet-friendly-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error filtering pet-friendly properties.')).toBeInTheDocument();
}, 10000);


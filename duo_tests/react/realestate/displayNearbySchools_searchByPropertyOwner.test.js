import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayNearbySchools_searchByPropertyOwner';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('shows information about nearby schools for a property', async () => {
  fetchMock.get('/property/1/schools', { body: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Schools')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('schoolInfo')).toBeInTheDocument();
}, 10000);

test('fails to display nearby schools due to network error', async () => {
  fetchMock.get('/property/1/schools', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Schools')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load nearby schools')).toBeInTheDocument();
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
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayPropertyApp_searchByPropertyOwner';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Display property investment potential successfully', async () => {
  fetchMock.get('/api/investment-potential', { metrics: 'High' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-investment-potential-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('High')).toBeInTheDocument();
}, 10000);

test('Display property investment potential fails with error', async () => {
  fetchMock.get('/api/investment-potential', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-investment-potential-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error displaying investment potential.')).toBeInTheDocument();
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
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './compareProperties_paginationOfSearchResults';

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

test('splits search results across multiple pages', async () => {
  fetchMock.get('/properties?page=2', { body: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('nextPage')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('listingResult')).toBeInTheDocument();
}, 10000);

test('fails to paginate search results due to network error', async () => {
  fetchMock.get('/properties?page=2', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('nextPage')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load next page of results')).toBeInTheDocument();
}, 10000);
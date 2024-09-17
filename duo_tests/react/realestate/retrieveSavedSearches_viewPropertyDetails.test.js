import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './retrieveSavedSearches_viewPropertyDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully retrieves saved searches', async () => {
  fetchMock.get('/api/search/list', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('retrieve-searches-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('retrieved-searches')).toBeInTheDocument();
}, 10000);

test('fails to retrieve saved searches and shows error message', async () => {
  fetchMock.get('/api/search/list', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('retrieve-searches-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('retrieve-error')).toBeInTheDocument();
}, 10000);

test('displays detailed information about a property', async () => {
  fetchMock.get('/property/1', { body: {} });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('propertyDetail')).toBeInTheDocument();
}, 10000);

test('fails to display property details due to network error', async () => {
  fetchMock.get('/property/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load property details')).toBeInTheDocument();
}, 10000);
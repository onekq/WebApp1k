import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './retrieveSavedSearches_viewApp';

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

test('View similar properties successfully', async () => {
  fetchMock.get('/api/similar-properties', { properties: [{ id: 1, name: "Prop 1" }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-similar-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Prop 1')).toBeInTheDocument();
}, 10000);

test('View similar properties fails with error', async () => {
  fetchMock.get('/api/similar-properties', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-similar-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error loading similar properties.')).toBeInTheDocument();
}, 10000);
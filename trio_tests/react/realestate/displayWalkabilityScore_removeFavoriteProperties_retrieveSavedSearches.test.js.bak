import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayWalkabilityScore_removeFavoriteProperties_retrieveSavedSearches';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Display walkability score successfully', async () => {
  fetchMock.get('/api/walkability-score', { score: 85 });

  await act(async () => { render(<MemoryRouter><WalkabilityScore /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-walkability-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('85')).toBeInTheDocument();
}, 10000);

test('Display walkability score fails with error', async () => {
  fetchMock.get('/api/walkability-score', 500);

  await act(async () => { render(<MemoryRouter><WalkabilityScore /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-walkability-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error displaying walkability score.')).toBeInTheDocument();
}, 10000);

test('successfully removes favorite properties', async () => {
  fetchMock.post('/api/favorites/remove', 200);

  await act(async () => { render(<MemoryRouter><RemoveFavoriteProperties /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-favorite-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('remove-confirmation')).toBeInTheDocument();
}, 10000);

test('fails to remove favorite properties and shows error message', async () => {
  fetchMock.post('/api/favorites/remove', 500);

  await act(async () => { render(<MemoryRouter><RemoveFavoriteProperties /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-favorite-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('remove-error')).toBeInTheDocument();
}, 10000);

test('successfully retrieves saved searches', async () => {
  fetchMock.get('/api/search/list', 200);

  await act(async () => { render(<MemoryRouter><RetrieveSavedSearches /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('retrieve-searches-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('retrieved-searches')).toBeInTheDocument();
}, 10000);

test('fails to retrieve saved searches and shows error message', async () => {
  fetchMock.get('/api/search/list', 500);

  await act(async () => { render(<MemoryRouter><RetrieveSavedSearches /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('retrieve-searches-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('retrieve-error')).toBeInTheDocument();
}, 10000);

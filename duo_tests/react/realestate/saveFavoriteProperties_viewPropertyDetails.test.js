import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './saveFavoriteProperties_viewPropertyDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully saves favorite properties', async () => {
  fetchMock.post('/api/favorites', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-favorite-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('favorite-confirmation')).toBeInTheDocument();
}, 10000);

test('fails to save favorite properties and shows error message', async () => {
  fetchMock.post('/api/favorites', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-favorite-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('favorite-error')).toBeInTheDocument();
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
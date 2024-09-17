import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayCrimeRates_saveFavoriteProperties';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('shows crime rates in the property\'s area', async () => {
  fetchMock.get('/property/1/crime', { body: {} });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Crime')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('crimeInfo')).toBeInTheDocument();
}, 10000);

test('fails to display crime rates due to network error', async () => {
  fetchMock.get('/property/1/crime', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Crime')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load crime rates')).toBeInTheDocument();
}, 10000);

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
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import PropertyListing from './displayCrimeRates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('shows crime rates in the property\'s area', async () => {
  fetchMock.get('/property/1/crime', { body: {} });

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Crime')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('crimeInfo')).toBeInTheDocument();
}, 10000);

test('fails to display crime rates due to network error', async () => {
  fetchMock.get('/property/1/crime', 500);

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Crime')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load crime rates')).toBeInTheDocument();
}, 10000);
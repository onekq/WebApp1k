import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import PropertyListing from './viewPropertyDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('displays detailed information about a property', async () => {
  fetchMock.get('/property/1', { body: {} });

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('propertyDetail')).toBeInTheDocument();
}, 10000);

test('fails to display property details due to network error', async () => {
  fetchMock.get('/property/1', 500);

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load property details')).toBeInTheDocument();
}, 10000);


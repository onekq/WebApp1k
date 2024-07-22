import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import PropertyListing from './displayNearbyPublicTransport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('shows information about nearby public transportation', async () => {
  fetchMock.get('/property/1/transport', { body: [] });

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Transport')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('transportInfo')).toBeInTheDocument();
}, 10000);

test('fails to display nearby public transport due to network error', async () => {
  fetchMock.get('/property/1/transport', 500);

  await act(async () => { render(<MemoryRouter><PropertyListing /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Transport')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load nearby transport')).toBeInTheDocument();
}, 10000);


import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByYearBuilt_mapIntegration';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Filter by Year Built filters properties by the year they were built successfully', async () => {
  fetchMock.get('/api/properties?yearBuilt=2010', {
    status: 200,
    body: [{ id: 1, yearBuilt: 2010 }]
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/year built/i), { target: { value: '2010' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Built in 2010')).toBeInTheDocument();
}, 10000);

test('Filter by Year Built filters properties by the year they were built fails', async () => {
  fetchMock.get('/api/properties?yearBuilt=2010', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/year built/i), { target: { value: '2010' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);

test('shows the property location on a map', async () => {
  fetchMock.get('/property/1/location', { body: {} });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Map')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('propertyMap')).toBeInTheDocument();
}, 10000);

test('fails to display property location on map due to network error', async () => {
  fetchMock.get('/property/1/location', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Map')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load property map')).toBeInTheDocument();
}, 10000);
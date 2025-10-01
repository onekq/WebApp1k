import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayCrimeRates_displayNearbyPublicTransport_searchByMlsNumber';

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

test('shows information about nearby public transportation', async () => {
  fetchMock.get('/property/1/transport', { body: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Transport')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('transportInfo')).toBeInTheDocument();
}, 10000);

test('fails to display nearby public transport due to network error', async () => {
  fetchMock.get('/property/1/transport', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Transport')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load nearby transport')).toBeInTheDocument();
}, 10000);

test('Successfully searches by MLS number.', async () => {
  fetchMock.get('/api/properties?mls=12345', { data: { property: 'Property Data' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('mls-input'), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls('/api/properties?mls=12345').length).toEqual(1);
  expect(screen.getByText('Property Data')).toBeInTheDocument();
}, 10000);

test('Fails to search by MLS number with error message.', async () => {
  fetchMock.get('/api/properties?mls=12345', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('mls-input'), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls('/api/properties?mls=12345').length).toEqual(1);
  expect(screen.getByText('Failed to retrieve property')).toBeInTheDocument();
}, 10000);

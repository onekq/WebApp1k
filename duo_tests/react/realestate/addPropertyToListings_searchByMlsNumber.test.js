import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addPropertyToListings_searchByMlsNumber';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully adds a property to the listings.', async () => {
  fetchMock.post('/api/properties', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('property-title'), { target: { value: 'New Property' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/properties').length).toEqual(1);
  expect(screen.getByText('Property added successfully')).toBeInTheDocument();
}, 10000);

test('Fails to add a property to the listings with error message.', async () => {
  fetchMock.post('/api/properties', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('property-title'), { target: { value: 'New Property' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/properties').length).toEqual(1);
  expect(screen.getByText('Failed to add property')).toBeInTheDocument();
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
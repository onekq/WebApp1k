import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './compareProperties_deletePropertyFromListings_searchByLocation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully compares properties', async () => {
  fetchMock.post('/api/properties/compare', 200);

  await act(async () => { render(<MemoryRouter><CompareProperties /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('compare-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('comparison-result')).toBeInTheDocument();
}, 10000);

test('fails to compare properties and shows error message', async () => {
  fetchMock.post('/api/properties/compare', 500);

  await act(async () => { render(<MemoryRouter><CompareProperties /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('compare-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('comparison-error')).toBeInTheDocument();
}, 10000);

test('Successfully deletes a property from the listings.', async () => {
  fetchMock.delete('/api/properties/1', { success: true });

  await act(async () => { render(<MemoryRouter><DeleteProperty /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/api/properties/1').length).toEqual(1);
  expect(screen.getByText('Property deleted successfully')).toBeInTheDocument();
}, 10000);

test('Fails to delete a property from the listings with error message.', async () => {
  fetchMock.delete('/api/properties/1', 400);

  await act(async () => { render(<MemoryRouter><DeleteProperty /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/api/properties/1').length).toEqual(1);
  expect(screen.getByText('Failed to delete property')).toBeInTheDocument();
}, 10000);

test('Search by Location filters properties by location successfully', async () => {
  fetchMock.get('/api/properties?location=newyork', {
    status: 200,
    body: [{ id: 1, location: 'New York' }]
  });

  await act(async () => render(<MemoryRouter><PropertySearch /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'newyork' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('New York')).toBeInTheDocument();
}, 10000);

test('Search by Location filters properties by location fails', async () => {
  fetchMock.get('/api/properties?location=newyork', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><PropertySearch /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'newyork' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);

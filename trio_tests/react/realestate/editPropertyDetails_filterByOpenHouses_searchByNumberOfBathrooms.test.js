import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editPropertyDetails_filterByOpenHouses_searchByNumberOfBathrooms';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully edits property details.', async () => {
  fetchMock.put('/api/properties/1', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('property-title'), { target: { value: 'Updated Property' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/properties/1').length).toEqual(1);
  expect(screen.getByText('Property updated successfully')).toBeInTheDocument();
}, 10000);

test('Fails to edit property details with error message.', async () => {
  fetchMock.put('/api/properties/1', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('property-title'), { target: { value: 'Updated Property' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/properties/1').length).toEqual(1);
  expect(screen.getByText('Failed to update property')).toBeInTheDocument();
}, 10000);

test('Filter by open houses successfully', async () => {
  fetchMock.get('/api/open-houses', { properties: [{ id: 1, name: "Open House 1" }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-open-houses-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Open House 1')).toBeInTheDocument();
}, 10000);

test('Filter by open houses fails with error', async () => {
  fetchMock.get('/api/open-houses', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-open-houses-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error filtering open houses.')).toBeInTheDocument();
}, 10000);

test('Search by Number of Bathrooms filters properties by number of bathrooms successfully', async () => {
  fetchMock.get('/api/properties?bathrooms=2', {
    status: 200,
    body: [{ id: 1, bathrooms: 2 }]
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/bathrooms/i), { target: { value: '2' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('2 bathrooms')).toBeInTheDocument();
}, 10000);

test('Search by Number of Bathrooms filters properties by number of bathrooms fails', async () => {
  fetchMock.get('/api/properties?bathrooms=2', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/bathrooms/i), { target: { value: '2' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);

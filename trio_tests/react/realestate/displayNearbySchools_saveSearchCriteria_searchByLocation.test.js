import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayNearbySchools_saveSearchCriteria_searchByLocation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('shows information about nearby schools for a property', async () => {
  fetchMock.get('/property/1/schools', { body: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Schools')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('schoolInfo')).toBeInTheDocument();
}, 10000);

test('fails to display nearby schools due to network error', async () => {
  fetchMock.get('/property/1/schools', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Schools')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load nearby schools')).toBeInTheDocument();
}, 10000);

test('successfully saves search criteria', async () => {
  fetchMock.post('/api/search/save', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-criteria'), { target: { value: '2BHK' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-search-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('save-success')).toBeInTheDocument();
}, 10000);

test('fails to save search criteria and shows error message', async () => {
  fetchMock.post('/api/search/save', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-criteria'), { target: { value: '2BHK' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-search-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('save-error')).toBeInTheDocument();
}, 10000);

test('Search by Location filters properties by location successfully', async () => {
  fetchMock.get('/api/properties?location=newyork', {
    status: 200,
    body: [{ id: 1, location: 'New York' }]
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
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

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'newyork' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);

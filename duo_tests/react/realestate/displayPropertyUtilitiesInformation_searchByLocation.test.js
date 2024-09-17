import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayApprmation_searchByLocation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully displays property utilities information.', async () => {
  fetchMock.get('/api/properties/1/utilities', { data: 'Utilities Information' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-utilities-button')); });

  expect(fetchMock.calls('/api/properties/1/utilities').length).toEqual(1);
  expect(screen.getByText('Utilities Information')).toBeInTheDocument();
}, 10000);

test('Fails to display property utilities information with error message.', async () => {
  fetchMock.get('/api/properties/1/utilities', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-utilities-button')); });

  expect(fetchMock.calls('/api/properties/1/utilities').length).toEqual(1);
  expect(screen.getByText('Failed to retrieve utilities information')).toBeInTheDocument();
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
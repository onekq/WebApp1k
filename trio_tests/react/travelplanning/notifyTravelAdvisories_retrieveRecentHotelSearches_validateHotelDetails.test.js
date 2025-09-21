import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './notifyTravelAdvisories_retrieveRecentHotelSearches_validateHotelDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should render travel advisories and alerts', async () => {
  fetchMock.get('/api/advisories', { advisories: ['Avoid downtown area', 'Check local news'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'Mexico' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Advisories')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Avoid downtown area')).toBeInTheDocument();
}, 10000);

test('should show error if fetching travel advisories fails', async () => {
  fetchMock.get('/api/advisories', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'Mexico' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Advisories')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load advisories')).toBeInTheDocument();
}, 10000);

test('retrieveRecentHotelSearches - retrieves recent hotel searches successfully', async () => {
  fetchMock.get('/api/hotels/recent', {
    body: [{ id: 4, name: 'Recent Hotel' }],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('retrieve-recent-searches'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recent Hotel')).toBeInTheDocument();
}, 10000);

test('retrieveRecentHotelSearches - shows error message when retrieval fails', async () => {
  fetchMock.get('/api/hotels/recent', {
    body: { message: 'Retrieval Error' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('retrieve-recent-searches'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Retrieval Error')).toBeInTheDocument();
}, 10000);

test('validateHotelDetails - validates hotel details successfully before booking', async () => {
  fetchMock.get('/api/hotels/1/details', {
    body: { id: 1, name: 'Checked Hotel' },
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('validate-hotel-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Checked Hotel')).toBeInTheDocument();
}, 10000);

test('validateHotelDetails - shows error when validation fails', async () => {
  fetchMock.get('/api/hotels/1/details', {
    body: { message: 'Validation Error' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('validate-hotel-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Validation Error')).toBeInTheDocument();
}, 10000);

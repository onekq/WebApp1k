import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByAmenities_receivePropertyAlerts_sortByDateListed';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Filter by Amenities filters properties by amenities successfully', async () => {
  fetchMock.get('/api/properties?amenities=pool', {
    status: 200,
    body: [{ id: 1, amenities: ['pool'] }]
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/amenities/i), { target: { value: 'pool' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('pool')).toBeInTheDocument();
}, 10000);

test('Filter by Amenities filters properties by amenities fails', async () => {
  fetchMock.get('/api/properties?amenities=pool', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/amenities/i), { target: { value: 'pool' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);

test('successfully receives property alerts', async () => {
  fetchMock.get('/api/alerts', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('receive-alerts-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('alerts-list')).toBeInTheDocument();
}, 10000);

test('fails to receive property alerts and shows error message', async () => {
  fetchMock.get('/api/alerts', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('receive-alerts-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('alerts-error')).toBeInTheDocument();
}, 10000);

test('sorts property listings by the date they were listed', async () => {
  fetchMock.get('/properties?sort=date', { body: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sortDate'), { target: { value: 'desc' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitSort')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('listingResult')).toBeInTheDocument();
}, 10000);

test('fails to sort property listings by date due to network error', async () => {
  fetchMock.get('/properties?sort=date', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sortDate'), { target: { value: 'desc' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitSort')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to sort properties by date')).toBeInTheDocument();
}, 10000);

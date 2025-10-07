import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculatePropertyValue_searchByPropertyOwner_filterByPropertyFeatures_viewOpenHouseSchedule';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully calculates property value. (from calculatePropertyValue_searchByPropertyOwner)', async () => {
  fetchMock.post('/api/properties/value', { value: 500000 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('property-details'), { target: { value: 'Property Details' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-button')); });

  expect(fetchMock.calls('/api/properties/value').length).toEqual(1);
  expect(screen.getByText('$500,000')).toBeInTheDocument();
}, 10000);

test('Fails to calculate property value with error message. (from calculatePropertyValue_searchByPropertyOwner)', async () => {
  fetchMock.post('/api/properties/value', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('property-details'), { target: { value: 'Property Details' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-button')); });

  expect(fetchMock.calls('/api/properties/value').length).toEqual(1);
  expect(screen.getByText('Failed to calculate value')).toBeInTheDocument();
}, 10000);

test('Search by property owner successfully (from calculatePropertyValue_searchByPropertyOwner)', async () => {
  fetchMock.get('/api/properties-by-owner', { properties: [{ id: 1, owner: "Owner 1" }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('owner-search-input'), { target: { value: 'Owner 1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-by-owner-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Owner 1')).toBeInTheDocument();
}, 10000);

test('Search by property owner fails with error (from calculatePropertyValue_searchByPropertyOwner)', async () => {
  fetchMock.get('/api/properties-by-owner', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('owner-search-input'), { target: { value: 'Owner 1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-by-owner-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error searching properties by owner.')).toBeInTheDocument();
}, 10000);

test('Filter by Property Features filters properties by features successfully (from filterByPropertyFeatures_viewOpenHouseSchedule)', async () => {
  fetchMock.get('/api/properties?features=balcony', {
    status: 200,
    body: [{ id: 1, features: ['balcony'] }]
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/features/i), { target: { value: 'balcony' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('balcony')).toBeInTheDocument();
}, 10000);

test('Filter by Property Features filters properties by features fails (from filterByPropertyFeatures_viewOpenHouseSchedule)', async () => {
  fetchMock.get('/api/properties?features=balcony', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/features/i), { target: { value: 'balcony' } }));
  await act(async () => fireEvent.click(screen.getByText(/filter/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);

test('View open house schedule successfully (from filterByPropertyFeatures_viewOpenHouseSchedule)', async () => {
  fetchMock.get('/api/open-house-schedule', { schedule: 'Sun 2-4 PM' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-schedule-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Sun 2-4 PM')).toBeInTheDocument();
}, 10000);

test('View open house schedule fails with error (from filterByPropertyFeatures_viewOpenHouseSchedule)', async () => {
  fetchMock.get('/api/open-house-schedule', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-schedule-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error fetching open house schedule.')).toBeInTheDocument();
}, 10000);


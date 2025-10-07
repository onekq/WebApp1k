import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './mapIntegration_viewOpenHouseSchedule_searchByPriceRange_sortByDateListed';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('shows the property location on a map (from mapIntegration_viewOpenHouseSchedule)', async () => {
  fetchMock.get('/property/1/location', { body: {} });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Map')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('propertyMap')).toBeInTheDocument();
}, 10000);

test('fails to display property location on map due to network error (from mapIntegration_viewOpenHouseSchedule)', async () => {
  fetchMock.get('/property/1/location', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('property1Map')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load property map')).toBeInTheDocument();
}, 10000);

test('View open house schedule successfully (from mapIntegration_viewOpenHouseSchedule)', async () => {
  fetchMock.get('/api/open-house-schedule', { schedule: 'Sun 2-4 PM' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-schedule-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Sun 2-4 PM')).toBeInTheDocument();
}, 10000);

test('View open house schedule fails with error (from mapIntegration_viewOpenHouseSchedule)', async () => {
  fetchMock.get('/api/open-house-schedule', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-schedule-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error fetching open house schedule.')).toBeInTheDocument();
}, 10000);

test('Search by Price Range filters properties within a specified price range successfully (from searchByPriceRange_sortByDateListed)', async () => {
  fetchMock.get('/api/properties?minPrice=50000&maxPrice=200000', {
    status: 200,
    body: [{ id: 1, price: 100000 }]
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/min price/i), { target: { value: '50000' } }));
  await act(async () => fireEvent.change(screen.getByLabelText(/max price/i), { target: { value: '200000' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('100000')).toBeInTheDocument();
}, 10000);

test('Search by Price Range filters properties within a specified price range fails (from searchByPriceRange_sortByDateListed)', async () => {
  fetchMock.get('/api/properties?minPrice=50000&maxPrice=200000', {
    status: 500,
    body: { error: 'Server Error' }
  });

  await act(async () => render(<MemoryRouter><App /></MemoryRouter>));
  await act(async () => fireEvent.change(screen.getByLabelText(/min price/i), { target: { value: '50000' } }));
  await act(async () => fireEvent.change(screen.getByLabelText(/max price/i), { target: { value: '200000' } }));
  await act(async () => fireEvent.click(screen.getByText(/search/i)));

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/server error/i)).toBeInTheDocument();
}, 10000);

test('sorts property listings by the date they were listed (from searchByPriceRange_sortByDateListed)', async () => {
  fetchMock.get('/properties?sort=date', { body: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sortDate'), { target: { value: 'desc' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitSort')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('listingResult')).toBeInTheDocument();
}, 10000);

test('fails to sort property listings by date due to network error (from searchByPriceRange_sortByDateListed)', async () => {
  fetchMock.get('/properties?sort=date', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sortDate'), { target: { value: 'desc' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitSort')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to sort properties by date')).toBeInTheDocument();
}, 10000);


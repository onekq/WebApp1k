import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addFlightsToItinerary_savePreferredFlights_customerSupport_recommendPackingLists';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds flights to an itinerary. (from addFlightsToItinerary_savePreferredFlights)', async () => {
  fetchMock.post('/api/add-flight', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('flight-input'), { target: { value: 'Flight1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-flight-button')); });

  expect(fetchMock.calls('/api/add-flight', 'POST')).toHaveLength(1);
  expect(screen.getByTestId('flight1')).toBeInTheDocument();
}, 10000);

test('fails to add flights due to network error. (from addFlightsToItinerary_savePreferredFlights)', async () => {
  fetchMock.post('/api/add-flight', { status: 500, body: { error: 'Network error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('flight-input'), { target: { value: 'Flight1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-flight-button')); });

  expect(fetchMock.calls('/api/add-flight', 'POST')).toHaveLength(1);
  expect(screen.getByText('Network error')).toBeInTheDocument();
}, 10000);

test('SavePreferredFlights - save preferred flight successfully (from addFlightsToItinerary_savePreferredFlights)', async () => {
  fetchMock.post('/api/save-flight', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Flight')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Flight saved to wishlist')).toBeInTheDocument();
}, 10000);

test('SavePreferredFlights - save preferred flight fails with error message (from addFlightsToItinerary_savePreferredFlights)', async () => {
  fetchMock.post('/api/save-flight', { throws: new Error('Failed to save flight') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Flight')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save flight')).toBeInTheDocument();
}, 10000);

test('Customer support options should be provided successfully. (from customerSupport_recommendPackingLists)', async () => {
  fetchMock.get('/api/support/options', [{ id: 1, method: 'Phone' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('get-support-options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('support-options')).toBeInTheDocument();
}, 10000);

test('Error in offering customer support should show error message. (from customerSupport_recommendPackingLists)', async () => {
  fetchMock.get('/api/support/options', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('get-support-options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('support-error')).toBeInTheDocument();
}, 10000);

test('should render recommended packing lists based on destination and trip duration (from customerSupport_recommendPackingLists)', async () => {
  fetchMock.get('/api/packing-lists', { packingList: ['Sunscreen', 'Swimwear'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination and duration'), { target: { value: 'Hawaii, 7 days' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Packing List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sunscreen')).toBeInTheDocument();
}, 10000);

test('should show error if fetching recommended packing lists fails (from customerSupport_recommendPackingLists)', async () => {
  fetchMock.get('/api/packing-lists', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination and duration'), { target: { value: 'Hawaii, 7 days' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Packing List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load packing lists')).toBeInTheDocument();
}, 10000);


import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './provideDestinationRecommendations_retrieveRecentFlightSearches_sendItineraryUpdates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should render destination recommendations based on user preferences', async () => {
  fetchMock.get('/api/recommendations', { destinations: ['Paris', 'London', 'Tokyo'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter preferences'), { target: { value: 'beach' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Recommendations')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Paris')).toBeInTheDocument();
}, 10000);

test('should show error if fetching destination recommendations fails', async () => {
  fetchMock.get('/api/recommendations', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter preferences'), { target: { value: 'beach' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Recommendations')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load recommendations')).toBeInTheDocument();
}, 10000);

test('RetrieveRecentFlightSearches - retrieve recent flight searches successfully', async () => {
  fetchMock.get('/api/recent-searches', {
    searches: [{ id: 1, origin: 'SFO', destination: 'NYC' }]
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Recent Searches')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('SFO to NYC')).toBeInTheDocument();
}, 10000);

test('RetrieveRecentFlightSearches - retrieve recent flight search fails with error message', async () => {
  fetchMock.get('/api/recent-searches', { throws: new Error('Failed to retrieve recent searches') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Recent Searches')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to retrieve recent searches')).toBeInTheDocument();
}, 10000);

test('successfully sends itinerary updates.', async () => {
  fetchMock.post('/api/send-updates', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('send-updates-button')); });

  expect(fetchMock.calls('/api/send-updates', 'POST')).toHaveLength(1);
  expect(screen.getByText('Updates sent')).toBeInTheDocument();
}, 10000);

test('fails to send updates due to invalid email.', async () => {
  fetchMock.post('/api/send-updates', { status: 400, body: { error: 'Invalid email address' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('send-updates-button')); });

  expect(fetchMock.calls('/api/send-updates', 'POST')).toHaveLength(1);
  expect(screen.getByText('Invalid email address')).toBeInTheDocument();
}, 10000);

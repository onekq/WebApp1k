import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './sortHotels_suggestTravelInsurance_validateItineraryConflicts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('sortHotels - sorts hotel search results successfully', async () => {
  fetchMock.get('/api/hotels?sort=price', {
    body: [{ id: 3, name: 'Affordable Hotel' }],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('sort-price'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Affordable Hotel')).toBeInTheDocument();
}, 10000);

test('sortHotels - shows error message on sorting failure', async () => {
  fetchMock.get('/api/hotels?sort=price', {
    body: { message: 'Sorting Error' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('sort-price'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sorting Error')).toBeInTheDocument();
}, 10000);

test('should render suggested travel insurance options', async () => {
  fetchMock.get('/api/insurance', { insurance: ['InsureMyTrip', 'World Nomads'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination and travel dates'), { target: { value: 'USA, 2024-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Insurance')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('InsureMyTrip')).toBeInTheDocument();
}, 10000);

test('should show error if fetching travel insurance options fails', async () => {
  fetchMock.get('/api/insurance', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination and travel dates'), { target: { value: 'USA, 2024-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Insurance')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load insurance options')).toBeInTheDocument();
}, 10000);

test('successfully validates itinerary conflicts.', async () => {
  fetchMock.post('/api/validate-conflicts', { status: 200, body: { conflicts: [] } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-conflicts-button')); });

  expect(fetchMock.calls('/api/validate-conflicts', 'POST')).toHaveLength(1);
  expect(screen.getByText('No conflicts')).toBeInTheDocument();
}, 10000);

test('fails to validate itinerary conflicts due to conflicts.', async () => {
  fetchMock.post('/api/validate-conflicts', { status: 400, body: { conflicts: ['Conflict1'] } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-conflicts-button')); });

  expect(fetchMock.calls('/api/validate-conflicts', 'POST')).toHaveLength(1);
  expect(screen.getByText('Conflict1')).toBeInTheDocument();
}, 10000);

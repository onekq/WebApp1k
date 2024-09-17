import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './searchHotels_sendItineraryUpdates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('searchHotels - should display hotel search results on successful search', async () => {
  fetchMock.get('/api/hotels?destination=Paris&dates=2023-01-01_to_2023-01-10&guests=2', {
    body: [{ id: 1, name: 'Hotel Paris' }],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('destination-input'), { target: { value: 'Paris' } });
    fireEvent.click(screen.getByTestId('search-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Hotel Paris')).toBeInTheDocument();
}, 10000);

test('searchHotels - should display an error message on search failure', async () => {
  fetchMock.get('/api/hotels?destination=Paris&dates=2023-01-01_to_2023-01-10&guests=2', {
    body: { message: 'Network Error' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('destination-input'), { target: { value: 'Paris' } });
    fireEvent.click(screen.getByTestId('search-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);

test('successfully sends itinerary updates.', async () => {
  fetchMock.post('/api/send-updates', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('send-updates-button')); });

  expect(fetchMock.calls('/api/send-updates', 'POST')).toHaveLength(1);
  expect(screen.getByText('Updates sent')).toBeInTheDocument();
}, 10000);

test('fails to send updates due to invalid email.', async () => {
  fetchMock.post('/api/send-updates', { status: 400, body: { error: 'Invalid email address' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('send-updates-button')); });

  expect(fetchMock.calls('/api/send-updates', 'POST')).toHaveLength(1);
  expect(screen.getByText('Invalid email address')).toBeInTheDocument();
}, 10000);
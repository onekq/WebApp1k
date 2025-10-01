import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './saveAndRetrieveItineraries_searchHotels_userPreferences';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully saves an itinerary to user profile.', async () => {
  fetchMock.post('/api/save-itinerary', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-itinerary-button')); });

  expect(fetchMock.calls('/api/save-itinerary', 'POST')).toHaveLength(1);
  expect(screen.getByText('Itinerary saved')).toBeInTheDocument();
}, 10000);

test('fails to save itinerary due to a server error.', async () => {
  fetchMock.post('/api/save-itinerary', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-itinerary-button')); });

  expect(fetchMock.calls('/api/save-itinerary', 'POST')).toHaveLength(1);
  expect(screen.getByText('Server error')).toBeInTheDocument();
}, 10000);

test('searchHotels - should display hotel search results on successful search', async () => {
  fetchMock.get('/api/hotels?destination=Paris&dates=2023-01-01_to_2023-01-10&guests=2', {
    body: [{ id: 1, name: 'Hotel Paris' }],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
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
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('destination-input'), { target: { value: 'Paris' } });
    fireEvent.click(screen.getByTestId('search-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);

test('User preferences should be stored and applied successfully.', async () => {
  fetchMock.post('/api/user/preferences', 200);

  await act(async () => { render(<MemoryRouter><UserPreferencesComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('preference-input'), { target: { value: 'preference' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('preference-saved')).toBeInTheDocument();
}, 10000);

test('Error in storing user preferences should show error message.', async () => {
  fetchMock.post('/api/user/preferences', 500);

  await act(async () => { render(<MemoryRouter><UserPreferencesComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('preference-input'), { target: { value: 'preference' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('preference-error')).toBeInTheDocument();
}, 10000);

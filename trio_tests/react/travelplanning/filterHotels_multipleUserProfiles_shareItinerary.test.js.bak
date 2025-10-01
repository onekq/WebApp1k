import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterHotels_multipleUserProfiles_shareItinerary';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('filterHotels - filters hotels successfully based on criteria', async () => {
  fetchMock.get('/api/hotels?filters=star_5', {
    body: [{ id: 2, name: 'Luxury Hotel' }],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('filter-star-5'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Luxury Hotel')).toBeInTheDocument();
}, 10000);

test('filterHotels - shows error message when no hotels match the filters', async () => {
  fetchMock.get('/api/hotels?filters=star_5', {
    body: [],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('filter-star-5'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No hotels available')).toBeInTheDocument();
}, 10000);

test('Multiple user profiles should be managed successfully.', async () => {
  fetchMock.get('/api/user/profiles', [{ id: 1, name: 'John Doe' }]);

  await act(async () => { render(<MemoryRouter><UserProfileComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('get-profiles')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('profiles-list')).toBeInTheDocument();
}, 10000);

test('Error in managing user profiles should show error message.', async () => {
  fetchMock.get('/api/user/profiles', 404);

  await act(async () => { render(<MemoryRouter><UserProfileComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('get-profiles')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('profiles-error')).toBeInTheDocument();
}, 10000);

test('successfully shares an itinerary with other users.', async () => {
  fetchMock.post('/api/share-itinerary', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('share-input'), { target: { value: 'user@example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-itinerary-button')); });

  expect(fetchMock.calls('/api/share-itinerary', 'POST')).toHaveLength(1);
  expect(screen.getByText('Itinerary shared')).toBeInTheDocument();
}, 10000);

test('fails to share itinerary due to invalid email.', async () => {
  fetchMock.post('/api/share-itinerary', { status: 400, body: { error: 'Invalid email address' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('share-input'), { target: { value: 'invalid-email' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-itinerary-button')); });

  expect(fetchMock.calls('/api/share-itinerary', 'POST')).toHaveLength(1);
  expect(screen.getByText('Invalid email address')).toBeInTheDocument();
}, 10000);

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './checkRoomAvailability_sortHotels_userPreferences';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('checkRoomAvailability - checks room availability for selected hotels', async () => {
  fetchMock.get('/api/hotels/1/rooms?dates=2023-01-01_to_2023-01-10', {
    body: { available: true },
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('check-availability-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Available')).toBeInTheDocument();
}, 10000);

test('checkRoomAvailability - shows error message when room availability check fails', async () => {
  fetchMock.get('/api/hotels/1/rooms?dates=2023-01-01_to_2023-01-10', {
    body: { available: false, message: 'No rooms available' },
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('check-availability-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No rooms available')).toBeInTheDocument();
}, 10000);

test('sortHotels - sorts hotel search results successfully', async () => {
  fetchMock.get('/api/hotels?sort=price', {
    body: [{ id: 3, name: 'Affordable Hotel' }],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
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
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('sort-price'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sorting Error')).toBeInTheDocument();
}, 10000);

test('User preferences should be stored and applied successfully.', async () => {
  fetchMock.post('/api/user/preferences', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('preference-input'), { target: { value: 'preference' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('preference-saved')).toBeInTheDocument();
}, 10000);

test('Error in storing user preferences should show error message.', async () => {
  fetchMock.post('/api/user/preferences', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('preference-input'), { target: { value: 'preference' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('preference-error')).toBeInTheDocument();
}, 10000);

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './removeItemsFromItinerary_shareItinerary_suggestActivities';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully removes items from an itinerary.', async () => {
  fetchMock.delete('/api/remove-item', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-item-button')); });

  expect(fetchMock.calls('/api/remove-item', 'DELETE')).toHaveLength(1);
  expect(screen.queryByTestId('item1')).not.toBeInTheDocument();
}, 10000);

test('fails to remove items due to network error.', async () => {
  fetchMock.delete('/api/remove-item', { status: 500, body: { error: 'Network error' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-item-button')); });

  expect(fetchMock.calls('/api/remove-item', 'DELETE')).toHaveLength(1);
  expect(screen.getByText('Network error')).toBeInTheDocument();
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

test('should render suggested activities at the destination', async () => {
  fetchMock.get('/api/activities', { activities: ['Hiking', 'Snorkeling'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'Hawaii' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Activities')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Hiking')).toBeInTheDocument();
}, 10000);

test('should show error if fetching suggested activities fails', async () => {
  fetchMock.get('/api/activities', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'Hawaii' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Activities')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load activities')).toBeInTheDocument();
}, 10000);

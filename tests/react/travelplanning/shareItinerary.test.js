import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './shareItinerary';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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


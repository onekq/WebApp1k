import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './saveAndRetrieveItineraries';

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


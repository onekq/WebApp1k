import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './sendItineraryUpdates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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


import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './checkSeatAvailability';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('CheckSeatAvailability - check seat availability successfully', async () => {
  fetchMock.get('/api/seat-availability', { available: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Check Seat Availability')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Seats are available')).toBeInTheDocument();
}, 10000);

test('CheckSeatAvailability - check seat availability fails with error message', async () => {
  fetchMock.get('/api/seat-availability', { available: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Check Seat Availability')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Seats are not available')).toBeInTheDocument();
}, 10000);


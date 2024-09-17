import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './automatedReminders_waitlistManagement';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully sends automated reminders for deadlines', async () => {
  fetchMock.post('/reminders', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Send Reminders')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Reminders sent')).toBeInTheDocument();
}, 10000);

test('Fails to send automated reminders for deadlines', async () => {
  fetchMock.post('/reminders', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Send Reminders')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Reminders failed')).toBeInTheDocument();
}, 10000);

test('Users can be successfully added to the waitlist.', async () => {
  fetchMock.post('/api/waitlist', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Join Waitlist/i)); });

  expect(fetchMock.calls('/api/waitlist').length).toEqual(1);
  expect(screen.getByText(/Added to waitlist successfully/i)).toBeInTheDocument();
}, 10000);

test('Adding users to the waitlist fails with an error.', async () => {
  fetchMock.post('/api/waitlist', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Join Waitlist/i)); });

  expect(fetchMock.calls('/api/waitlist').length).toEqual(1);
  expect(screen.getByText(/Failed to join waitlist/i)).toBeInTheDocument();
}, 10000);
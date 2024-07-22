import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import NotifyForm from './productAvailabilityNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Product availability notification succeeds.', async () => {
  fetchMock.post('/api/notify', { status: 200, body: { message: 'Notification set successfully' } });

  await act(async () => { render(<MemoryRouter><NotifyForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Me')); });

  expect(fetchMock.calls('/api/notify').length).toBe(1);
  expect(screen.getByText('Notification set successfully')).toBeInTheDocument();
}, 10000);

test('Product availability notification fails with error message.', async () => {
  fetchMock.post('/api/notify', { status: 400, body: { message: 'Invalid email address' } });

  await act(async () => { render(<MemoryRouter><NotifyForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Me')); });

  expect(fetchMock.calls('/api/notify').length).toBe(1);
  expect(screen.getByText('Invalid email address')).toBeInTheDocument();
}, 10000);


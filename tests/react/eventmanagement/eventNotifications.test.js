import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import EventApp from './eventNotifications';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displays success message upon sending event notifications', async () => {
  fetchMock.post('/api/event/notify', { success: true });

  await act(async () => { render(<MemoryRouter><EventApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('notify-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Event notifications sent successfully')).toBeInTheDocument();
}, 10000);

test('Displays error message upon failing to send event notifications', async () => {
  fetchMock.post('/api/event/notify', 400);

  await act(async () => { render(<MemoryRouter><EventApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('notify-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to send event notifications')).toBeInTheDocument();
}, 10000);


import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './eventArchiving_eventNotifications';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displays success message upon event archiving', async () => {
  fetchMock.post('/api/event/archive', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('archive-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Event archived successfully')).toBeInTheDocument();
}, 10000);

test('Displays error message upon failing to archive event', async () => {
  fetchMock.post('/api/event/archive', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('archive-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to archive the event')).toBeInTheDocument();
}, 10000);

test('Displays success message upon sending event notifications', async () => {
  fetchMock.post('/api/event/notify', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('notify-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Event notifications sent successfully')).toBeInTheDocument();
}, 10000);

test('Displays error message upon failing to send event notifications', async () => {
  fetchMock.post('/api/event/notify', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('notify-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to send event notifications')).toBeInTheDocument();
}, 10000);
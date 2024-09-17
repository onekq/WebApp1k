import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './eventCancellation_validateEventTags';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displays successful cancellation message upon event cancellation', async () => {
  fetchMock.post('/api/event/cancel', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('cancel-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Event successfully cancelled')).toBeInTheDocument();
}, 10000);

test('Displays error message upon failing to cancel an event', async () => {
  fetchMock.post('/api/event/cancel', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('cancel-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to cancel the event')).toBeInTheDocument();
}, 10000);

test('Should successfully add valid event tags', async () => {
  fetchMock.post('/events', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/tags/i), { target: { value: 'tech, conference' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should show error for invalid event tag characters', async () => {
  fetchMock.post('/events', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/tags/i), { target: { value: 'tech, con*ference' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/invalid characters in tags/i)).toBeInTheDocument();
}, 10000);
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './eventArchiving_validateConcurrentSessions_validateTicketQuantity';

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

test('Successfully validates no overlapping concurrent sessions.', async () => {
  fetchMock.post('/api/validateConcurrentSessions', { valid: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-concurrent-sessions-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No overlap in concurrent sessions')).toBeInTheDocument();
}, 10000);

test('Fails to validate overlapping concurrent sessions.', async () => {
  fetchMock.post('/api/validateConcurrentSessions', { error: 'Sessions overlap' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-concurrent-sessions-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sessions overlap')).toBeInTheDocument();
}, 10000);

test('ticket quantity within event capacity', async () => {
  fetchMock.post('/ticketQuantity', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketQuantity'), { target: { value: '50' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(fetchMock.calls('/ticketQuantity').length).toEqual(1);
  expect(screen.getByText('Ticket quantity set')).toBeInTheDocument();
}, 10000);

test('ticket quantity exceeds event capacity', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketQuantity'), { target: { value: '1000' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(screen.getByText('Quantity exceeds event capacity.')).toBeInTheDocument();
}, 10000);

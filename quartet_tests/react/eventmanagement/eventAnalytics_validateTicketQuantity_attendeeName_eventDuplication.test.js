import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './eventAnalytics_validateTicketQuantity_attendeeName_eventDuplication';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displays accurate event analytics (from eventAnalytics_validateTicketQuantity)', async () => {
  fetchMock.get('/api/event/analytics', { count: 100, sales: 50 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Attendee count: 100')).toBeInTheDocument();
  expect(screen.getByText('Ticket sales: 50')).toBeInTheDocument();
}, 10000);

test('Displays error message when analytics data is inaccurate (from eventAnalytics_validateTicketQuantity)', async () => {
  fetchMock.get('/api/event/analytics', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to fetch event analytics')).toBeInTheDocument();
}, 10000);

test('ticket quantity within event capacity (from eventAnalytics_validateTicketQuantity)', async () => {
  fetchMock.post('/ticketQuantity', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketQuantity'), { target: { value: '50' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(fetchMock.calls('/ticketQuantity').length).toEqual(1);
  expect(screen.getByText('Ticket quantity set')).toBeInTheDocument();
}, 10000);

test('ticket quantity exceeds event capacity (from eventAnalytics_validateTicketQuantity)', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketQuantity'), { target: { value: '1000' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(screen.getByText('Quantity exceeds event capacity.')).toBeInTheDocument();
}, 10000);

test('Attendee name is successfully validated and submitted (from attendeeName_eventDuplication)', async () => {
  fetchMock.post('/register-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
}, 10000);

test('Attendee name validation fails if left empty (from attendeeName_eventDuplication)', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(0);
  expect(screen.getByText(/name is required/i)).toBeInTheDocument();
}, 10000);

test('Displays success message upon event duplication (from attendeeName_eventDuplication)', async () => {
  fetchMock.post('/api/event/duplicate', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('duplicate-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Event duplicated successfully')).toBeInTheDocument();
}, 10000);

test('Displays error message upon failing to duplicate event (from attendeeName_eventDuplication)', async () => {
  fetchMock.post('/api/event/duplicate', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('duplicate-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to duplicate the event')).toBeInTheDocument();
}, 10000);


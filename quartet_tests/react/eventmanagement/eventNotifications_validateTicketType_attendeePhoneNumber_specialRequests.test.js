import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './eventNotifications_validateTicketType_attendeePhoneNumber_specialRequests';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displays success message upon sending event notifications (from eventNotifications_validateTicketType)', async () => {
  fetchMock.post('/api/event/notify', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('notify-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Event notifications sent successfully')).toBeInTheDocument();
}, 10000);

test('Displays error message upon failing to send event notifications (from eventNotifications_validateTicketType)', async () => {
  fetchMock.post('/api/event/notify', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('notify-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to send event notifications')).toBeInTheDocument();
}, 10000);

test('selects ticket type successfully (from eventNotifications_validateTicketType)', async () => {
  fetchMock.post('/ticketType', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketType'), { target: { value: 'VIP' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(fetchMock.calls('/ticketType').length).toEqual(1);
  expect(screen.getByText('Ticket type selected')).toBeInTheDocument();
}, 10000);

test('fails to select ticket type (from eventNotifications_validateTicketType)', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(screen.getByText('Please select a ticket type.')).toBeInTheDocument();
}, 10000);

test('Attendee phone number is successfully validated if format is correct (from attendeePhoneNumber_specialRequests)', async () => {
  fetchMock.post('/register-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '123-456-7890' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
}, 10000);

test('Attendee phone number validation fails if format is incorrect (from attendeePhoneNumber_specialRequests)', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(0);
  expect(screen.getByText(/invalid phone number format/i)).toBeInTheDocument();
}, 10000);

test('Special requests are successfully recorded (from attendeePhoneNumber_specialRequests)', async () => {
  fetchMock.post('/register-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/special requests/i), { target: { value: 'Wheelchair access' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
}, 10000);

test('Special requests recording fails if not provided when specified (from attendeePhoneNumber_specialRequests)', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(0);
  expect(screen.getByText(/please specify special requests/i)).toBeInTheDocument();
}, 10000);


import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './dietaryRestrictions_eventNotifications_validateTicketSalesEndDate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Dietary restrictions are successfully submitted if provided', async () => {
  fetchMock.post('/register-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/dietary restrictions/i), { target: { value: 'Vegetarian' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
}, 10000);

test('Registration fails if dietary restrictions are not provided when required', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(0);
  expect(screen.getByText(/please specify dietary restrictions/i)).toBeInTheDocument();
}, 10000);

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

test('ticket sales end date before event start date', async () => {
  fetchMock.post('/ticketSalesEndDate', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('salesEndDate'), { target: { value: '2023-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(fetchMock.calls('/ticketSalesEndDate').length).toEqual(1);
  expect(screen.getByText('Sales end date set')).toBeInTheDocument();
}, 10000);

test('ticket sales end date after event start date', async () => {
  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('salesEndDate'), { target: { value: '2024-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(screen.getByText('Sales end date must be before event start date.')).toBeInTheDocument();
}, 10000);

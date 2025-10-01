import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './validateCalendarExport_validateSessionReminders_validateTicketSalesStartDate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully validates calendar export.', async () => {
  fetchMock.post('/api/validateCalendarExport', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('export-calendar-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Calendar exported')).toBeInTheDocument();
}, 10000);

test('Fails to validate calendar export.', async () => {
  fetchMock.post('/api/validateCalendarExport', { error: 'Failed to export calendar' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('export-calendar-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to export calendar')).toBeInTheDocument();
}, 10000);

test('Successfully validates session reminders.', async () => {
  fetchMock.post('/api/validateSessionReminders', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-reminders-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Reminders set')).toBeInTheDocument();
}, 10000);

test('Fails to validate session reminders.', async () => {
  fetchMock.post('/api/validateSessionReminders', { error: 'Failed to set reminders' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-reminders-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to set reminders')).toBeInTheDocument();
}, 10000);

test('ticket sales start date before event start date', async () => {
  fetchMock.post('/ticketSalesStartDate', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('salesStartDate'), { target: { value: '2023-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(fetchMock.calls('/ticketSalesStartDate').length).toEqual(1);
  expect(screen.getByText('Sales start date set')).toBeInTheDocument();
}, 10000);

test('ticket sales start date after event start date', async () => {
  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('salesStartDate'), { target: { value: '2024-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(screen.getByText('Sales start date must be before event start date.')).toBeInTheDocument();
}, 10000);

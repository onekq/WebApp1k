import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './groupRegistrations_validateCalendarExport_validateTicketType';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Group registrations are successfully supported', async () => {
  fetchMock.post('/register-group', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/group size/i), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/group registration successful/i)).toBeInTheDocument();
}, 10000);

test('Group registration fails if exceeding max group size', async () => {
  fetchMock.post('/register-group', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/group size/i), { target: { value: '20' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/group size exceeds limit/i)).toBeInTheDocument();
}, 10000);

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

test('selects ticket type successfully', async () => {
  fetchMock.post('/ticketType', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketType'), { target: { value: 'VIP' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(fetchMock.calls('/ticketType').length).toEqual(1);
  expect(screen.getByText('Ticket type selected')).toBeInTheDocument();
}, 10000);

test('fails to select ticket type', async () => {
  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(screen.getByText('Please select a ticket type.')).toBeInTheDocument();
}, 10000);

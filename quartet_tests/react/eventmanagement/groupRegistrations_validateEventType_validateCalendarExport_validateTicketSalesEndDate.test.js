import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './groupRegistrations_validateEventType_validateCalendarExport_validateTicketSalesEndDate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Group registrations are successfully supported (from groupRegistrations_validateEventType)', async () => {
  fetchMock.post('/register-group', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/group size/i), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/group registration successful/i)).toBeInTheDocument();
}, 10000);

test('Group registration fails if exceeding max group size (from groupRegistrations_validateEventType)', async () => {
  fetchMock.post('/register-group', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/group size/i), { target: { value: '20' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/group size exceeds limit/i)).toBeInTheDocument();
}, 10000);

test('Should successfully submit event with valid type (from groupRegistrations_validateEventType)', async () => {
  fetchMock.post('/events', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/type/i), { target: { value: 'Conference' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should show error for not selecting event type (from groupRegistrations_validateEventType)', async () => {
  fetchMock.post('/events', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/type/i), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/event type is required/i)).toBeInTheDocument();
}, 10000);

test('Successfully validates calendar export. (from validateCalendarExport_validateTicketSalesEndDate)', async () => {
  fetchMock.post('/api/validateCalendarExport', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('export-calendar-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Calendar exported')).toBeInTheDocument();
}, 10000);

test('Fails to validate calendar export. (from validateCalendarExport_validateTicketSalesEndDate)', async () => {
  fetchMock.post('/api/validateCalendarExport', { error: 'Failed to export calendar' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('export-calendar-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to export calendar')).toBeInTheDocument();
}, 10000);

test('ticket sales end date before event start date (from validateCalendarExport_validateTicketSalesEndDate)', async () => {
  fetchMock.post('/ticketSalesEndDate', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('salesEndDate'), { target: { value: '2023-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(fetchMock.calls('/ticketSalesEndDate').length).toEqual(1);
  expect(screen.getByText('Sales end date set')).toBeInTheDocument();
}, 10000);

test('ticket sales end date after event start date (from validateCalendarExport_validateTicketSalesEndDate)', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('salesEndDate'), { target: { value: '2024-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(screen.getByText('Sales end date must be before event start date.')).toBeInTheDocument();
}, 10000);


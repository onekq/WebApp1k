import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './registrationDeadline_validateCalendarExport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Registration is successful if within the deadline', async () => {
  fetchMock.post('/register-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
}, 10000);

test('Registration fails if the deadline is passed', async () => {
  fetchMock.post('/register-attendee', { status: 403 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration deadline has passed/i)).toBeInTheDocument();
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
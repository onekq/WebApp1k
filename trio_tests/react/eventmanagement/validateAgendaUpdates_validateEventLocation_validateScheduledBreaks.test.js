import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './validateAgendaUpdates_validateEventLocation_validateScheduledBreaks';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully validates agenda updates.', async () => {
  fetchMock.post('/api/validateAgendaUpdates', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-agenda-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Agenda updated')).toBeInTheDocument();
}, 10000);

test('Fails to validate agenda updates.', async () => {
  fetchMock.post('/api/validateAgendaUpdates', { error: 'Could not update agenda' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-agenda-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Could not update agenda')).toBeInTheDocument();
}, 10000);

test('Should successfully submit valid event location', async () => {
  fetchMock.post('/events', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/location/i), { target: { value: '123 Event St' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should show error for missing event location', async () => {
  fetchMock.post('/events', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/location/i), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/location is required/i)).toBeInTheDocument();
}, 10000);

test('Successfully validates scheduled breaks.', async () => {
  fetchMock.post('/api/validateScheduledBreaks', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-break-schedule-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Breaks scheduled')).toBeInTheDocument();
}, 10000);

test('Fails to validate incorrect scheduled breaks.', async () => {
  fetchMock.post('/api/validateScheduledBreaks', { error: 'Breaks are incorrectly scheduled' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-break-schedule-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Breaks are incorrectly scheduled')).toBeInTheDocument();
}, 10000);

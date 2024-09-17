import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './groupRegistrations_validateAgendaItemTiming';

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

test('Successfully validates agenda item timing.', async () => {
  fetchMock.post('/api/validateAgendaItemTiming', { valid: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('agenda-start-time-input'), { target: { value: '10:00 AM' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('agenda-end-time-input'), { target: { value: '11:00 AM' } }); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-agenda-timing-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Timing is valid')).toBeInTheDocument();
}, 10000);

test('Fails to validate incorrect agenda item timing.', async () => {
  fetchMock.post('/api/validateAgendaItemTiming', { error: 'End time must be after start time' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('agenda-start-time-input'), { target: { value: '11:00 AM' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('agenda-end-time-input'), { target: { value: '10:00 AM' } }); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-agenda-timing-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('End time must be after start time')).toBeInTheDocument();
}, 10000);
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './attendeePhoneNumber_validateAgendaItemTiming';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Attendee phone number is successfully validated if format is correct', async () => {
  fetchMock.post('/register-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '123-456-7890' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
}, 10000);

test('Attendee phone number validation fails if format is incorrect', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(0);
  expect(screen.getByText(/invalid phone number format/i)).toBeInTheDocument();
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
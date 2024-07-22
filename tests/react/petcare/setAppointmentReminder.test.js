import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import RemindersComponent from './setAppointmentReminder';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should set a new appointment reminder successfully', async () => {
  fetchMock.post('/api/set-appointment-reminder', 200);

  await act(async () => {
    render(<MemoryRouter><RemindersComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Appointment Description/i), { target: { value: 'Vet visit' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Set Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Reminder set successfully/i)).toBeInTheDocument();
}, 10000);

test('should fail to set a new appointment reminder', async () => {
  fetchMock.post('/api/set-appointment-reminder', 500);

  await act(async () => {
    render(<MemoryRouter><RemindersComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Appointment Description/i), { target: { value: 'Vet visit' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Set Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Failed to set reminder/i)).toBeInTheDocument();
}, 10000);


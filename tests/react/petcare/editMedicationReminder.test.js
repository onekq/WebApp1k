import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import RemindersComponent from './editMedicationReminder';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should update an existing medication reminder successfully', async () => {
  fetchMock.put('/api/edit-medication-reminder', 200);

  await act(async () => {
    render(<MemoryRouter><RemindersComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/New Medication Name/i), { target: { value: 'Painkillers' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Update Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Reminder updated successfully/i)).toBeInTheDocument();
}, 10000);

test('should fail to update an existing medication reminder', async () => {
  fetchMock.put('/api/edit-medication-reminder', 500);

  await act(async () => {
    render(<MemoryRouter><RemindersComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/New Medication Name/i), { target: { value: 'Painkillers' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Update Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Failed to update reminder/i)).toBeInTheDocument();
}, 10000);


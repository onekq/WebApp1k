import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import RemindersComponent from './viewUpcomingReminders';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should load upcoming reminders successfully', async () => {
  fetchMock.get('/api/upcoming-reminders', {
    reminders: [
      { id: 1, type: 'Medication', description: 'Antibiotics' },
      { id: 2, type: 'Appointment', description: 'Vet visit' }
    ]
  });

  await act(async () => {
    render(<MemoryRouter><RemindersComponent /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Antibiotics/i)).toBeInTheDocument();
  expect(screen.getByText(/Vet visit/i)).toBeInTheDocument();
}, 10000);

test('should fail to load upcoming reminders', async () => {
  fetchMock.get('/api/upcoming-reminders', 500);

  await act(async () => {
    render(<MemoryRouter><RemindersComponent /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Failed to load reminders/i)).toBeInTheDocument();
}, 10000);
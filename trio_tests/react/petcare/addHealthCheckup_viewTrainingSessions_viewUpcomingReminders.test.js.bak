import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addHealthCheckup_viewTrainingSessions_viewUpcomingReminders';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Add health checkup successfully', async () => {
  fetchMock.post('/api/health-checkups', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('checkup-input'), { target: { value: 'Annual Checkup' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-checkups').length).toBe(1);
  expect(screen.getByText('Health checkup added')).toBeInTheDocument();
}, 10000);

test('Fail to add health checkup with error', async () => {
  fetchMock.post('/api/health-checkups', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('checkup-input'), { target: { value: '' } }); }); // Failure case: Empty input
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-checkups').length).toBe(1);
  expect(screen.getByText('Failed to add health checkup')).toBeInTheDocument(); // Error message
}, 10000);

test('Views training sessions list successfully.', async () => {
  fetchMock.get('/training-sessions', [{ description: 'Obedience training' }]);

  await act(async () => { render(<MemoryRouter><ViewTrainingSessions /></MemoryRouter>); });

  expect(fetchMock.calls('/training-sessions').length).toBe(1);
  expect(screen.getByText('Obedience training')).toBeInTheDocument();
}, 10000);

test('Fails to view training sessions list with error message.', async () => {
  fetchMock.get('/training-sessions', { status: 500, body: { message: 'Failed to fetch training sessions' } });

  await act(async () => { render(<MemoryRouter><ViewTrainingSessions /></MemoryRouter>); });

  expect(fetchMock.calls('/training-sessions').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

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

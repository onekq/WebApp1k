import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addHealthNotes_editAppointmentReminder_editTrainingSessionLog';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Add health notes successfully', async () => {
  fetchMock.post('/api/health-notes', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('notes-input'), { target: { value: 'Healthy!' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-notes').length).toBe(1);
  expect(screen.getByText('Health notes added')).toBeInTheDocument();
}, 10000);

test('Fail to add health notes with error', async () => {
  fetchMock.post('/api/health-notes', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('notes-input'), { target: { value: '' } }); }); // Failure case: Empty input
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-notes').length).toBe(1);
  expect(screen.getByText('Failed to add health notes')).toBeInTheDocument(); // Error message
}, 10000);

test('should update an existing appointment reminder successfully', async () => {
  fetchMock.put('/api/edit-appointment-reminder', 200);

  await act(async () => {
    render(<MemoryRouter><RemindersComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/New Appointment Description/i), { target: { value: 'Grooming' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Update Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Reminder updated successfully/i)).toBeInTheDocument();
}, 10000);

test('should fail to update an existing appointment reminder', async () => {
  fetchMock.put('/api/edit-appointment-reminder', 500);

  await act(async () => {
    render(<MemoryRouter><RemindersComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/New Appointment Description/i), { target: { value: 'Grooming' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Update Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Failed to update reminder/i)).toBeInTheDocument();
}, 10000);

test('Edits a training session log successfully.', async () => {
  fetchMock.put('/training-sessions/1', { message: 'Training session updated' });

  await act(async () => { render(<MemoryRouter><EditTrainingSessionLog trainingId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('training-input'), { target: { value: 'Updated training' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/training-sessions/1').length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Fails to edit training session log with error message.', async () => {
  fetchMock.put('/training-sessions/1', { status: 500, body: { message: 'Failed to update training session' } });

  await act(async () => { render(<MemoryRouter><EditTrainingSessionLog trainingId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('training-input'), { target: { value: 'Updated training' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/training-sessions/1').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deletePetProfile_editActivityLog_setAppointmentReminder';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Delete pet profile successfully.', async () => {
  fetchMock.delete('/api/pets/1', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete Pet/i)); });

  expect(fetchMock.calls('/api/pets/1').length).toBe(1);
  expect(screen.getByText('Pet profile deleted successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to delete pet profile due to server error.', async () => {
  fetchMock.delete('/api/pets/1', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete Pet/i)); });

  expect(fetchMock.calls('/api/pets/1').length).toBe(1);
  expect(screen.getByText('Failed to delete pet profile.')).toBeInTheDocument();
}, 10000);

test('Edits an activity log successfully.', async () => {
  fetchMock.put('/activities/1', { message: 'Activity updated' });

  await act(async () => { render(<MemoryRouter><EditActivityLog activityId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('activity-input'), { target: { value: 'Updated walk' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/activities/1').length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Fails to edit activity log with error message.', async () => {
  fetchMock.put('/activities/1', { status: 500, body: { message: 'Failed to update activity' } });

  await act(async () => { render(<MemoryRouter><EditActivityLog activityId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('activity-input'), { target: { value: 'Updated walk' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/activities/1').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

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

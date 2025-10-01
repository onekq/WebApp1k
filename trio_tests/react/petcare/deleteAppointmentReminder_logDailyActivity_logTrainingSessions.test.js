import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteAppointmentReminder_logDailyActivity_logTrainingSessions';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should delete an appointment reminder successfully', async () => {
  fetchMock.delete('/api/delete-appointment-reminder', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Delete Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Reminder deleted successfully/i)).toBeInTheDocument();
}, 10000);

test('should fail to delete an appointment reminder', async () => {
  fetchMock.delete('/api/delete-appointment-reminder', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Delete Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Failed to delete reminder/i)).toBeInTheDocument();
}, 10000);

test('Logs a daily activity successfully.', async () => {
  fetchMock.post('/activities', { message: 'Activity logged' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('activity-input'), { target: { value: 'Walk the dog' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/activities').length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Fails to log a daily activity with error message.', async () => {
  fetchMock.post('/activities', { status: 500, body: { message: 'Failed to log activity' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('activity-input'), { target: { value: 'Walk the dog' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/activities').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Logs a training session successfully.', async () => {
  fetchMock.post('/training-sessions', { message: 'Training session logged' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('training-input'), { target: { value: 'Obedience training' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/training-sessions').length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Fails to log a training session with error message.', async () => {
  fetchMock.post('/training-sessions', { status: 500, body: { message: 'Failed to log training session' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('training-input'), { target: { value: 'Obedience training' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/training-sessions').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

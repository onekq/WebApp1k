import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addPetProfile_deleteMedicationReminder_deleteTrainingSessionLog';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Add pet profile successfully.', async () => {
  fetchMock.post('/api/pets', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/name/i), {target: {value: 'Fluffy'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Pet/i)); });

  expect(fetchMock.calls('/api/pets').length).toBe(1);
  expect(screen.getByText('Pet profile added successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to add pet profile due to missing name.', async () => {
  fetchMock.post('/api/pets', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/name/i), {target: {value: ''}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Pet/i)); });

  expect(fetchMock.calls('/api/pets').length).toBe(1);
  expect(screen.getByText('Name is required.')).toBeInTheDocument();
}, 10000);

test('should delete a medication reminder successfully', async () => {
  fetchMock.delete('/api/delete-medication-reminder', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Delete Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Reminder deleted successfully/i)).toBeInTheDocument();
}, 10000);

test('should fail to delete a medication reminder', async () => {
  fetchMock.delete('/api/delete-medication-reminder', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Delete Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Failed to delete reminder/i)).toBeInTheDocument();
}, 10000);

test('Deletes a training session log successfully.', async () => {
  fetchMock.delete('/training-sessions/1', { message: 'Training session deleted' });

  await act(async () => { render(<MemoryRouter><App trainingId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/training-sessions/1').length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Fails to delete training session log with error message.', async () => {
  fetchMock.delete('/training-sessions/1', { status: 500, body: { message: 'Failed to delete training session' } });

  await act(async () => { render(<MemoryRouter><App trainingId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/training-sessions/1').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

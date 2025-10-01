import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteTrainingSessionLog_editPetMilestones_viewUpcomingReminders';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('Successfully edits a pet milestone', async () => {
  fetchMock.put('/api/milestones/edit', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('edit-milestone-button', { name: /edit/i })); });
  await act(async () => { fireEvent.change(screen.getByTestId('milestone-input'), { target: { value: 'Learned to Fetch' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-milestone-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Milestone updated successfully')).toBeInTheDocument();
}, 10000);

test('Fails to edit a pet milestone', async () => {
  fetchMock.put('/api/milestones/edit', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('edit-milestone-button', { name: /edit/i })); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-milestone-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update milestone')).toBeInTheDocument();
}, 10000);

test('should load upcoming reminders successfully', async () => {
  fetchMock.get('/api/upcoming-reminders', {
    reminders: [
      { id: 1, type: 'Medication', description: 'Antibiotics' },
      { id: 2, type: 'Appointment', description: 'Vet visit' }
    ]
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Antibiotics/i)).toBeInTheDocument();
  expect(screen.getByText(/Vet visit/i)).toBeInTheDocument();
}, 10000);

test('should fail to load upcoming reminders', async () => {
  fetchMock.get('/api/upcoming-reminders', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Failed to load reminders/i)).toBeInTheDocument();
}, 10000);

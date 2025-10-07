import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteTrainingSessionLog_setMedicationReminder_addHealthNotes_filterActivitiesByType';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Deletes a training session log successfully. (from deleteTrainingSessionLog_setMedicationReminder)', async () => {
  fetchMock.delete('/training-sessions/1', { message: 'Training session deleted' });

  await act(async () => { render(<MemoryRouter><App trainingId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/training-sessions/1').length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Fails to delete training session log with error message. (from deleteTrainingSessionLog_setMedicationReminder)', async () => {
  fetchMock.delete('/training-sessions/1', { status: 500, body: { message: 'Failed to delete training session' } });

  await act(async () => { render(<MemoryRouter><App trainingId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/training-sessions/1').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('should set a new medication reminder successfully (from deleteTrainingSessionLog_setMedicationReminder)', async () => {
  fetchMock.post('/api/set-medication-reminder', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Medication Name/i), { target: { value: 'Antibiotics' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Set Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Reminder set successfully/i)).toBeInTheDocument();
}, 10000);

test('should fail to set a new medication reminder (from deleteTrainingSessionLog_setMedicationReminder)', async () => {
  fetchMock.post('/api/set-medication-reminder', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Medication Name/i), { target: { value: 'Antibiotics' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Set Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Failed to set reminder/i)).toBeInTheDocument();
}, 10000);

test('Add health notes successfully (from addHealthNotes_filterActivitiesByType)', async () => {
  fetchMock.post('/api/health-notes', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('notes-input'), { target: { value: 'Healthy!' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-notes').length).toBe(1);
  expect(screen.getByText('Health notes added')).toBeInTheDocument();
}, 10000);

test('Fail to add health notes with error (from addHealthNotes_filterActivitiesByType)', async () => {
  fetchMock.post('/api/health-notes', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('notes-input'), { target: { value: '' } }); }); // Failure case: Empty input
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-notes').length).toBe(1);
  expect(screen.getByText('Failed to add health notes')).toBeInTheDocument(); // Error message
}, 10000);

test('Filters activities by type successfully. (from addHealthNotes_filterActivitiesByType)', async () => {
  fetchMock.get('/activities?type=walk', [{ type: 'walk', description: 'Morning walk' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('filter-input'), { target: { value: 'walk' } }); });

  expect(fetchMock.calls('/activities?type=walk').length).toBe(1);
  expect(screen.getByText('Morning walk')).toBeInTheDocument();
}, 10000);

test('Fails to filter activities by type with error message. (from addHealthNotes_filterActivitiesByType)', async () => {
  fetchMock.get('/activities?type=walk', { status: 500, body: { message: 'Failed to filter activities' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('filter-input'), { target: { value: 'walk' } }); });

  expect(fetchMock.calls('/activities?type=walk').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);


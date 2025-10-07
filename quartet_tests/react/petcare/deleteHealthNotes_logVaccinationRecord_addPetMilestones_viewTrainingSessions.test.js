import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteHealthNotes_logVaccinationRecord_addPetMilestones_viewTrainingSessions';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Delete health notes successfully (from deleteHealthNotes_logVaccinationRecord)', async () => {
  fetchMock.delete('/api/health-notes/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/api/health-notes/1').length).toBe(1);
  expect(screen.getByText('Health notes deleted')).toBeInTheDocument();
}, 10000);

test('Fail to delete health notes with error (from deleteHealthNotes_logVaccinationRecord)', async () => {
  fetchMock.delete('/api/health-notes/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/api/health-notes/1').length).toBe(1);
  expect(screen.getByText('Failed to delete health notes')).toBeInTheDocument(); // Error message
}, 10000);

test('Log vaccination record successfully (from deleteHealthNotes_logVaccinationRecord)', async () => {
  fetchMock.post('/api/vaccinations', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('vaccine-input'), { target: { value: 'Rabies' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/vaccinations').length).toBe(1);
  expect(screen.getByText('Vaccination record logged')).toBeInTheDocument();
}, 10000);

test('Fail to log vaccination record with error (from deleteHealthNotes_logVaccinationRecord)', async () => {
  fetchMock.post('/api/vaccinations', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('vaccine-input'), { target: { value: '' } }); }); // Failure case: Empty input
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/vaccinations').length).toBe(1);
  expect(screen.getByText('Failed to log vaccination record')).toBeInTheDocument(); // Error message
}, 10000);

test('Successfully adds a new pet milestone (from addPetMilestones_viewTrainingSessions)', async () => {
  fetchMock.post('/api/milestones/add', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('milestone-input'), { target: { value: 'Learned to Sit' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-milestone-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Milestone added successfully')).toBeInTheDocument();
}, 10000);

test('Fails to add new pet milestone (from addPetMilestones_viewTrainingSessions)', async () => {
  fetchMock.post('/api/milestones/add', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-milestone-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to add milestone')).toBeInTheDocument();
}, 10000);

test('Views training sessions list successfully. (from addPetMilestones_viewTrainingSessions)', async () => {
  fetchMock.get('/training-sessions', [{ description: 'Obedience training' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/training-sessions').length).toBe(1);
  expect(screen.getByText('Obedience training')).toBeInTheDocument();
}, 10000);

test('Fails to view training sessions list with error message. (from addPetMilestones_viewTrainingSessions)', async () => {
  fetchMock.get('/training-sessions', { status: 500, body: { message: 'Failed to fetch training sessions' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/training-sessions').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);


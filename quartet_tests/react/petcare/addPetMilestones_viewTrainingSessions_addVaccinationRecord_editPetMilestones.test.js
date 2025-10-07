import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addPetMilestones_viewTrainingSessions_addVaccinationRecord_editPetMilestones';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('Add vaccination record successfully. (from addVaccinationRecord_editPetMilestones)', async () => {
  fetchMock.post('/api/vaccinations', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/vaccine/i), {target: {value: 'Rabies'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Vaccination/i)); });

  expect(fetchMock.calls('/api/vaccinations').length).toBe(1);
  expect(screen.getByText('Vaccination record added successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to add vaccination record due to missing vaccine name. (from addVaccinationRecord_editPetMilestones)', async () => {
  fetchMock.post('/api/vaccinations', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/vaccine/i), {target: {value: ''}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Vaccination/i)); });

  expect(fetchMock.calls('/api/vaccinations').length).toBe(1);
  expect(screen.getByText('Vaccine name is required.')).toBeInTheDocument();
}, 10000);

test('Successfully edits a pet milestone (from addVaccinationRecord_editPetMilestones)', async () => {
  fetchMock.put('/api/milestones/edit', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('edit-milestone-button', { name: /edit/i })); });
  await act(async () => { fireEvent.change(screen.getByTestId('milestone-input'), { target: { value: 'Learned to Fetch' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-milestone-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Milestone updated successfully')).toBeInTheDocument();
}, 10000);

test('Fails to edit a pet milestone (from addVaccinationRecord_editPetMilestones)', async () => {
  fetchMock.put('/api/milestones/edit', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('edit-milestone-button', { name: /edit/i })); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-milestone-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update milestone')).toBeInTheDocument();
}, 10000);


import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteHealthNotes_viewSymptomsLog_addVaccinationRecord_editPetMilestones';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Delete health notes successfully (from deleteHealthNotes_viewSymptomsLog)', async () => {
  fetchMock.delete('/api/health-notes/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/api/health-notes/1').length).toBe(1);
  expect(screen.getByText('Health notes deleted')).toBeInTheDocument();
}, 10000);

test('Fail to delete health notes with error (from deleteHealthNotes_viewSymptomsLog)', async () => {
  fetchMock.delete('/api/health-notes/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/api/health-notes/1').length).toBe(1);
  expect(screen.getByText('Failed to delete health notes')).toBeInTheDocument(); // Error message
}, 10000);

test('View symptoms log successfully (from deleteHealthNotes_viewSymptomsLog)', async () => {
  fetchMock.get('/api/symptoms', [{ id: 1, description: 'Coughing' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/symptoms').length).toBe(1);
  expect(screen.getByText('Coughing')).toBeInTheDocument();
}, 10000);

test('Fail to view symptoms log with error (from deleteHealthNotes_viewSymptomsLog)', async () => {
  fetchMock.get('/api/symptoms', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/symptoms').length).toBe(1);
  expect(screen.getByText('Failed to fetch symptoms log')).toBeInTheDocument(); // Error message
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


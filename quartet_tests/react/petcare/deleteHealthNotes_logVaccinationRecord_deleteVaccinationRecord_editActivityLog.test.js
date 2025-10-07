import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteHealthNotes_logVaccinationRecord_deleteVaccinationRecord_editActivityLog';

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

test('Delete vaccination record successfully. (from deleteVaccinationRecord_editActivityLog)', async () => {
  fetchMock.delete('/api/vaccinations/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete Vaccination/i)); });

  expect(fetchMock.calls('/api/vaccinations/1').length).toBe(1);
  expect(screen.getByText('Vaccination record deleted successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to delete vaccination record due to server error. (from deleteVaccinationRecord_editActivityLog)', async () => {
  fetchMock.delete('/api/vaccinations/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete Vaccination/i)); });

  expect(fetchMock.calls('/api/vaccinations/1').length).toBe(1);
  expect(screen.getByText('Failed to delete vaccination record.')).toBeInTheDocument();
}, 10000);

test('Edits an activity log successfully. (from deleteVaccinationRecord_editActivityLog)', async () => {
  fetchMock.put('/activities/1', { message: 'Activity updated' });

  await act(async () => { render(<MemoryRouter><App activityId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('activity-input'), { target: { value: 'Updated walk' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/activities/1').length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Fails to edit activity log with error message. (from deleteVaccinationRecord_editActivityLog)', async () => {
  fetchMock.put('/activities/1', { status: 500, body: { message: 'Failed to update activity' } });

  await act(async () => { render(<MemoryRouter><App activityId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('activity-input'), { target: { value: 'Updated walk' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/activities/1').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);


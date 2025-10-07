import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteAllergies_deleteMedicationReminder_generateHealthReport_viewSymptomsLog';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Delete allergies successfully. (from deleteAllergies_deleteMedicationReminder)', async () => {
  fetchMock.delete('/api/allergies/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete Allergy/i)); });

  expect(fetchMock.calls('/api/allergies/1').length).toBe(1);
  expect(screen.getByText('Allergy deleted successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to delete allergies due to server error. (from deleteAllergies_deleteMedicationReminder)', async () => {
  fetchMock.delete('/api/allergies/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete Allergy/i)); });

  expect(fetchMock.calls('/api/allergies/1').length).toBe(1);
  expect(screen.getByText('Failed to delete allergy.')).toBeInTheDocument();
}, 10000);

test('should delete a medication reminder successfully (from deleteAllergies_deleteMedicationReminder)', async () => {
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

test('should fail to delete a medication reminder (from deleteAllergies_deleteMedicationReminder)', async () => {
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

test('Generate health report successfully (from generateHealthReport_viewSymptomsLog)', async () => {
  fetchMock.get('/api/health-report', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report-button')); });

  expect(fetchMock.calls('/api/health-report').length).toBe(1);
  expect(screen.getByText('Health report generated successfully')).toBeInTheDocument();
}, 10000);

test('Fail to generate health report with error (from generateHealthReport_viewSymptomsLog)', async () => {
  fetchMock.get('/api/health-report', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report-button')); });

  expect(fetchMock.calls('/api/health-report').length).toBe(1);
  expect(screen.getByText('Failed to generate health report')).toBeInTheDocument(); // Error message
}, 10000);

test('View symptoms log successfully (from generateHealthReport_viewSymptomsLog)', async () => {
  fetchMock.get('/api/symptoms', [{ id: 1, description: 'Coughing' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/symptoms').length).toBe(1);
  expect(screen.getByText('Coughing')).toBeInTheDocument();
}, 10000);

test('Fail to view symptoms log with error (from generateHealthReport_viewSymptomsLog)', async () => {
  fetchMock.get('/api/symptoms', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/symptoms').length).toBe(1);
  expect(screen.getByText('Failed to fetch symptoms log')).toBeInTheDocument(); // Error message
}, 10000);


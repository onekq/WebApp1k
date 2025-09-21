import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './setMedicationReminder_trackHealthMetrics_viewSymptomsLog';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should set a new medication reminder successfully', async () => {
  fetchMock.post('/api/set-medication-reminder', 200);

  await act(async () => {
    render(<MemoryRouter><RemindersComponent /></MemoryRouter>);
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

test('should fail to set a new medication reminder', async () => {
  fetchMock.post('/api/set-medication-reminder', 500);

  await act(async () => {
    render(<MemoryRouter><RemindersComponent /></MemoryRouter>);
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

test('Track health metrics successfully', async () => {
  fetchMock.post('/api/health-metrics', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('weight-input'), { target: { value: '10.2' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-metrics').length).toBe(1);
  expect(screen.getByText('Health metrics recorded successfully')).toBeInTheDocument();
}, 10000);

test('Fail to track health metrics with error', async () => {
  fetchMock.post('/api/health-metrics', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('weight-input'), { target: { value: '' } }); }); // Failure case: Empty input
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-metrics').length).toBe(1);
  expect(screen.getByText('Failed to record health metrics')).toBeInTheDocument(); // Error message
}, 10000);

test('View symptoms log successfully', async () => {
  fetchMock.get('/api/symptoms', [{ id: 1, description: 'Coughing' }]);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });

  expect(fetchMock.calls('/api/symptoms').length).toBe(1);
  expect(screen.getByText('Coughing')).toBeInTheDocument();
}, 10000);

test('Fail to view symptoms log with error', async () => {
  fetchMock.get('/api/symptoms', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });

  expect(fetchMock.calls('/api/symptoms').length).toBe(1);
  expect(screen.getByText('Failed to fetch symptoms log')).toBeInTheDocument(); // Error message
}, 10000);

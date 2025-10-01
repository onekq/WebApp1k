import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteCustomReminders_setMedicationReminder_viewActivitySummary';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should delete a custom reminder successfully', async () => {
  fetchMock.delete('/api/delete-custom-reminder', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Delete Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Reminder deleted successfully/i)).toBeInTheDocument();
}, 10000);

test('should fail to delete a custom reminder', async () => {
  fetchMock.delete('/api/delete-custom-reminder', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Delete Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Failed to delete reminder/i)).toBeInTheDocument();
}, 10000);

test('should set a new medication reminder successfully', async () => {
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

test('should fail to set a new medication reminder', async () => {
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

test('Views activity summary successfully.', async () => {
  fetchMock.get('/activities/summary', { summary: 'Activity summary data' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/activities/summary').length).toBe(1);
  expect(screen.getByText('Activity summary data')).toBeInTheDocument();
}, 10000);

test('Fails to view activity summary with error message.', async () => {
  fetchMock.get('/activities/summary', { status: 500, body: { message: 'Failed to fetch summary' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/activities/summary').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

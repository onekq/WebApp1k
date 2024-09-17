import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editMedicationReminder_viewPetMilestones';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should update an existing medication reminder successfully', async () => {
  fetchMock.put('/api/edit-medication-reminder', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/New Medication Name/i), { target: { value: 'Painkillers' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Update Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Reminder updated successfully/i)).toBeInTheDocument();
}, 10000);

test('should fail to update an existing medication reminder', async () => {
  fetchMock.put('/api/edit-medication-reminder', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/New Medication Name/i), { target: { value: 'Painkillers' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Update Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Failed to update reminder/i)).toBeInTheDocument();
}, 10000);

test('Successfully views pet milestones', async () => {
  fetchMock.get('/api/milestones/view', { status: 200, body: [{ id: 1, description: 'First birthday' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('First birthday')).toBeInTheDocument();
}, 10000);

test('Fails to view pet milestones', async () => {
  fetchMock.get('/api/milestones/view', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch milestones')).toBeInTheDocument();
}, 10000);
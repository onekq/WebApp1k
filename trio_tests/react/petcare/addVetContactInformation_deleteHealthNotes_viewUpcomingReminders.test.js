import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addVetContactInformation_deleteHealthNotes_viewUpcomingReminders';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Add vet contact information successfully.', async () => {
  fetchMock.post('/api/vets', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/vet name/i), {target: {value: 'Dr. Smith'}}); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/phone/i), {target: {value: '123-456-7890'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Vet Contact/i)); });

  expect(fetchMock.calls('/api/vets').length).toBe(1);
  expect(screen.getByText('Vet contact information added successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to add vet contact information due to missing vet name.', async () => {
  fetchMock.post('/api/vets', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/vet name/i), {target: {value: ''}}); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/phone/i), {target: {value: '123-456-7890'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Vet Contact/i)); });

  expect(fetchMock.calls('/api/vets').length).toBe(1);
  expect(screen.getByText('Vet name is required.')).toBeInTheDocument();
}, 10000);

test('Delete health notes successfully', async () => {
  fetchMock.delete('/api/health-notes/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/api/health-notes/1').length).toBe(1);
  expect(screen.getByText('Health notes deleted')).toBeInTheDocument();
}, 10000);

test('Fail to delete health notes with error', async () => {
  fetchMock.delete('/api/health-notes/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/api/health-notes/1').length).toBe(1);
  expect(screen.getByText('Failed to delete health notes')).toBeInTheDocument(); // Error message
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

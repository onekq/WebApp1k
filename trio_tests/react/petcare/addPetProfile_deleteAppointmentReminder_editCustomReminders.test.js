import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addPetProfile_deleteAppointmentReminder_editCustomReminders';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Add pet profile successfully.', async () => {
  fetchMock.post('/api/pets', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/name/i), {target: {value: 'Fluffy'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Pet/i)); });

  expect(fetchMock.calls('/api/pets').length).toBe(1);
  expect(screen.getByText('Pet profile added successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to add pet profile due to missing name.', async () => {
  fetchMock.post('/api/pets', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/name/i), {target: {value: ''}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Pet/i)); });

  expect(fetchMock.calls('/api/pets').length).toBe(1);
  expect(screen.getByText('Name is required.')).toBeInTheDocument();
}, 10000);

test('should delete an appointment reminder successfully', async () => {
  fetchMock.delete('/api/delete-appointment-reminder', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Delete Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Reminder deleted successfully/i)).toBeInTheDocument();
}, 10000);

test('should fail to delete an appointment reminder', async () => {
  fetchMock.delete('/api/delete-appointment-reminder', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Delete Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Failed to delete reminder/i)).toBeInTheDocument();
}, 10000);

test('should update an existing custom reminder successfully', async () => {
  fetchMock.put('/api/edit-custom-reminder', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/New Custom Event/i), { target: { value: 'Training session' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Update Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Reminder updated successfully/i)).toBeInTheDocument();
}, 10000);

test('should fail to update an existing custom reminder', async () => {
  fetchMock.put('/api/edit-custom-reminder', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/New Custom Event/i), { target: { value: 'Training session' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Update Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Failed to update reminder/i)).toBeInTheDocument();
}, 10000);

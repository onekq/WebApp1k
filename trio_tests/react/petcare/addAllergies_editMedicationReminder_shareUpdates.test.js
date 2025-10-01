import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addAllergies_editMedicationReminder_shareUpdates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Add allergies successfully.', async () => {
  fetchMock.post('/api/allergies', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/allergy/i), {target: {value: 'Peanuts'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Allergy/i)); });

  expect(fetchMock.calls('/api/allergies').length).toBe(1);
  expect(screen.getByText('Allergy added successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to add allergies due to missing allergy name.', async () => {
  fetchMock.post('/api/allergies', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/allergy/i), {target: {value: ''}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Allergy/i)); });

  expect(fetchMock.calls('/api/allergies').length).toBe(1);
  expect(screen.getByText('Allergy name is required.')).toBeInTheDocument();
}, 10000);

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

test('Successfully shares updates with the community', async () => {
  fetchMock.post('/api/community/share', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('update-input'), { target: { value: 'New update' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Update shared successfully')).toBeInTheDocument();
}, 10000);

test('Fails to share updates without input', async () => {
  fetchMock.post('/api/community/share', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to share update')).toBeInTheDocument();
}, 10000);

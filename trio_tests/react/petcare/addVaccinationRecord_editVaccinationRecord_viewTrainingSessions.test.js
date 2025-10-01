import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addVaccinationRecord_editVaccinationRecord_viewTrainingSessions';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Add vaccination record successfully.', async () => {
  fetchMock.post('/api/vaccinations', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/vaccine/i), {target: {value: 'Rabies'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Vaccination/i)); });

  expect(fetchMock.calls('/api/vaccinations').length).toBe(1);
  expect(screen.getByText('Vaccination record added successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to add vaccination record due to missing vaccine name.', async () => {
  fetchMock.post('/api/vaccinations', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/vaccine/i), {target: {value: ''}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Vaccination/i)); });

  expect(fetchMock.calls('/api/vaccinations').length).toBe(1);
  expect(screen.getByText('Vaccine name is required.')).toBeInTheDocument();
}, 10000);

test('Edit vaccination record successfully.', async () => {
  fetchMock.put('/api/vaccinations/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/vaccine/i), {target: {value: 'Rabies'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Edit Vaccination/i)); });

  expect(fetchMock.calls('/api/vaccinations/1').length).toBe(1);
  expect(screen.getByText('Vaccination record updated successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to edit vaccination record due to server error.', async () => {
  fetchMock.put('/api/vaccinations/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/vaccine/i), {target: {value: 'Rabies'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Edit Vaccination/i)); });

  expect(fetchMock.calls('/api/vaccinations/1').length).toBe(1);
  expect(screen.getByText('Failed to update vaccination record.')).toBeInTheDocument();
}, 10000);

test('Views training sessions list successfully.', async () => {
  fetchMock.get('/training-sessions', [{ description: 'Obedience training' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/training-sessions').length).toBe(1);
  expect(screen.getByText('Obedience training')).toBeInTheDocument();
}, 10000);

test('Fails to view training sessions list with error message.', async () => {
  fetchMock.get('/training-sessions', { status: 500, body: { message: 'Failed to fetch training sessions' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/training-sessions').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

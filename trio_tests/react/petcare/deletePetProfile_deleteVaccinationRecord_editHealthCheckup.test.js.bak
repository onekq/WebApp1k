import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deletePetProfile_deleteVaccinationRecord_editHealthCheckup';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Delete pet profile successfully.', async () => {
  fetchMock.delete('/api/pets/1', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete Pet/i)); });

  expect(fetchMock.calls('/api/pets/1').length).toBe(1);
  expect(screen.getByText('Pet profile deleted successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to delete pet profile due to server error.', async () => {
  fetchMock.delete('/api/pets/1', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete Pet/i)); });

  expect(fetchMock.calls('/api/pets/1').length).toBe(1);
  expect(screen.getByText('Failed to delete pet profile.')).toBeInTheDocument();
}, 10000);

test('Delete vaccination record successfully.', async () => {
  fetchMock.delete('/api/vaccinations/1', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete Vaccination/i)); });

  expect(fetchMock.calls('/api/vaccinations/1').length).toBe(1);
  expect(screen.getByText('Vaccination record deleted successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to delete vaccination record due to server error.', async () => {
  fetchMock.delete('/api/vaccinations/1', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete Vaccination/i)); });

  expect(fetchMock.calls('/api/vaccinations/1').length).toBe(1);
  expect(screen.getByText('Failed to delete vaccination record.')).toBeInTheDocument();
}, 10000);

test('Edit health checkup successfully', async () => {
  fetchMock.put('/api/health-checkups/1', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('checkup-input'), { target: { value: 'Bi-Annual Checkup' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-checkups/1').length).toBe(1);
  expect(screen.getByText('Health checkup updated')).toBeInTheDocument();
}, 10000);

test('Fail to edit health checkup with error', async () => {
  fetchMock.put('/api/health-checkups/1', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('checkup-input'), { target: { value: '' } }); }); // Failure case: Empty input
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-checkups/1').length).toBe(1);
  expect(screen.getByText('Failed to update health checkup')).toBeInTheDocument(); // Error message
}, 10000);

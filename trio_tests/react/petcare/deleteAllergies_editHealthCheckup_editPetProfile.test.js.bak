import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteAllergies_editHealthCheckup_editPetProfile';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Delete allergies successfully.', async () => {
  fetchMock.delete('/api/allergies/1', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete Allergy/i)); });

  expect(fetchMock.calls('/api/allergies/1').length).toBe(1);
  expect(screen.getByText('Allergy deleted successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to delete allergies due to server error.', async () => {
  fetchMock.delete('/api/allergies/1', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete Allergy/i)); });

  expect(fetchMock.calls('/api/allergies/1').length).toBe(1);
  expect(screen.getByText('Failed to delete allergy.')).toBeInTheDocument();
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

test('Edit pet profile successfully.', async () => {
  fetchMock.put('/api/pets/1', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/name/i), {target: {value: 'Fluffy'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Edit Pet/i)); });

  expect(fetchMock.calls('/api/pets/1').length).toBe(1);
  expect(screen.getByText('Pet profile updated successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to edit pet profile due to server error.', async () => {
  fetchMock.put('/api/pets/1', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/name/i), {target: {value: 'Fluffy'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Edit Pet/i)); });

  expect(fetchMock.calls('/api/pets/1').length).toBe(1);
  expect(screen.getByText('Failed to update pet profile.')).toBeInTheDocument();
}, 10000);

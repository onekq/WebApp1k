import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteAllergies_editVaccinationRecord_generateHealthReport';

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

test('Edit vaccination record successfully.', async () => {
  fetchMock.put('/api/vaccinations/1', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/vaccine/i), {target: {value: 'Rabies'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Edit Vaccination/i)); });

  expect(fetchMock.calls('/api/vaccinations/1').length).toBe(1);
  expect(screen.getByText('Vaccination record updated successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to edit vaccination record due to server error.', async () => {
  fetchMock.put('/api/vaccinations/1', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/vaccine/i), {target: {value: 'Rabies'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Edit Vaccination/i)); });

  expect(fetchMock.calls('/api/vaccinations/1').length).toBe(1);
  expect(screen.getByText('Failed to update vaccination record.')).toBeInTheDocument();
}, 10000);

test('Generate health report successfully', async () => {
  fetchMock.get('/api/health-report', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report-button')); });

  expect(fetchMock.calls('/api/health-report').length).toBe(1);
  expect(screen.getByText('Health report generated successfully')).toBeInTheDocument();
}, 10000);

test('Fail to generate health report with error', async () => {
  fetchMock.get('/api/health-report', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report-button')); });

  expect(fetchMock.calls('/api/health-report').length).toBe(1);
  expect(screen.getByText('Failed to generate health report')).toBeInTheDocument(); // Error message
}, 10000);

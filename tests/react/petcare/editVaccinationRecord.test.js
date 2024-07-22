import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './editVaccinationRecord';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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


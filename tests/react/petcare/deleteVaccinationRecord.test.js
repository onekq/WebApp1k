import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './deleteVaccinationRecord';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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


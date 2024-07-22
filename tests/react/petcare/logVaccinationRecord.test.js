import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './logVaccinationRecord';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Log vaccination record successfully', async () => {
  fetchMock.post('/api/vaccinations', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('vaccine-input'), { target: { value: 'Rabies' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/vaccinations').length).toBe(1);
  expect(screen.getByText('Vaccination record logged')).toBeInTheDocument();
}, 10000);

test('Fail to log vaccination record with error', async () => {
  fetchMock.post('/api/vaccinations', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('vaccine-input'), { target: { value: '' } }); }); // Failure case: Empty input
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/vaccinations').length).toBe(1);
  expect(screen.getByText('Failed to log vaccination record')).toBeInTheDocument(); // Error message
}, 10000);


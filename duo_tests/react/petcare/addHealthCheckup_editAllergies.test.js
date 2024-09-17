import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addHealthCheckup_editAllergies';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Add health checkup successfully', async () => {
  fetchMock.post('/api/health-checkups', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('checkup-input'), { target: { value: 'Annual Checkup' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-checkups').length).toBe(1);
  expect(screen.getByText('Health checkup added')).toBeInTheDocument();
}, 10000);

test('Fail to add health checkup with error', async () => {
  fetchMock.post('/api/health-checkups', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('checkup-input'), { target: { value: '' } }); }); // Failure case: Empty input
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-checkups').length).toBe(1);
  expect(screen.getByText('Failed to add health checkup')).toBeInTheDocument(); // Error message
}, 10000);

test('Edit allergies successfully.', async () => {
  fetchMock.put('/api/allergies/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/allergy/i), {target: {value: 'Peanuts'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Edit Allergy/i)); });

  expect(fetchMock.calls('/api/allergies/1').length).toBe(1);
  expect(screen.getByText('Allergy updated successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to edit allergies due to server error.', async () => {
  fetchMock.put('/api/allergies/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/allergy/i), {target: {value: 'Peanuts'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Edit Allergy/i)); });

  expect(fetchMock.calls('/api/allergies/1').length).toBe(1);
  expect(screen.getByText('Failed to update allergy.')).toBeInTheDocument();
}, 10000);
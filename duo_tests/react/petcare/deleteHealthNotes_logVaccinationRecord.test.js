import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteHealthNotes_logVaccinationRecord';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Delete health notes successfully', async () => {
  fetchMock.delete('/api/health-notes/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/api/health-notes/1').length).toBe(1);
  expect(screen.getByText('Health notes deleted')).toBeInTheDocument();
}, 10000);

test('Fail to delete health notes with error', async () => {
  fetchMock.delete('/api/health-notes/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/api/health-notes/1').length).toBe(1);
  expect(screen.getByText('Failed to delete health notes')).toBeInTheDocument(); // Error message
}, 10000);

test('Log vaccination record successfully', async () => {
  fetchMock.post('/api/vaccinations', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('vaccine-input'), { target: { value: 'Rabies' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/vaccinations').length).toBe(1);
  expect(screen.getByText('Vaccination record logged')).toBeInTheDocument();
}, 10000);

test('Fail to log vaccination record with error', async () => {
  fetchMock.post('/api/vaccinations', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('vaccine-input'), { target: { value: '' } }); }); // Failure case: Empty input
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/vaccinations').length).toBe(1);
  expect(screen.getByText('Failed to log vaccination record')).toBeInTheDocument(); // Error message
}, 10000);
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addHealthCheckup_editTrainingSessionLog';

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

test('Edits a training session log successfully.', async () => {
  fetchMock.put('/training-sessions/1', { message: 'Training session updated' });

  await act(async () => { render(<MemoryRouter><App trainingId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('training-input'), { target: { value: 'Updated training' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/training-sessions/1').length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Fails to edit training session log with error message.', async () => {
  fetchMock.put('/training-sessions/1', { status: 500, body: { message: 'Failed to update training session' } });

  await act(async () => { render(<MemoryRouter><App trainingId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('training-input'), { target: { value: 'Updated training' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/training-sessions/1').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import EditTrainingSessionLog from './editTrainingSessionLog';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Edits a training session log successfully.', async () => {
  fetchMock.put('/training-sessions/1', { message: 'Training session updated' });

  await act(async () => { render(<MemoryRouter><EditTrainingSessionLog trainingId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('training-input'), { target: { value: 'Updated training' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/training-sessions/1').length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Fails to edit training session log with error message.', async () => {
  fetchMock.put('/training-sessions/1', { status: 500, body: { message: 'Failed to update training session' } });

  await act(async () => { render(<MemoryRouter><EditTrainingSessionLog trainingId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('training-input'), { target: { value: 'Updated training' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/training-sessions/1').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);


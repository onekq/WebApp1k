import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import DeleteTrainingSessionLog from './deleteTrainingSessionLog';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Deletes a training session log successfully.', async () => {
  fetchMock.delete('/training-sessions/1', { message: 'Training session deleted' });

  await act(async () => { render(<MemoryRouter><DeleteTrainingSessionLog trainingId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/training-sessions/1').length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Fails to delete training session log with error message.', async () => {
  fetchMock.delete('/training-sessions/1', { status: 500, body: { message: 'Failed to delete training session' } });

  await act(async () => { render(<MemoryRouter><DeleteTrainingSessionLog trainingId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/training-sessions/1').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);
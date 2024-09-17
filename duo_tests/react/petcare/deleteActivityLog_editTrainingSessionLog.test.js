import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteActivityLog_editTrainingSessionLog';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Deletes an activity log successfully.', async () => {
  fetchMock.delete('/activities/1', { message: 'Activity deleted' });

  await act(async () => { render(<MemoryRouter><App activityId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/activities/1').length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Fails to delete activity log with error message.', async () => {
  fetchMock.delete('/activities/1', { status: 500, body: { message: 'Failed to delete activity' } });

  await act(async () => { render(<MemoryRouter><App activityId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/activities/1').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
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
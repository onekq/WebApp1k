import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteActivityLog_editTrainingSessionLog_addPetProfile_reportAPost';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Deletes an activity log successfully. (from deleteActivityLog_editTrainingSessionLog)', async () => {
  fetchMock.delete('/activities/1', { message: 'Activity deleted' });

  await act(async () => { render(<MemoryRouter><App activityId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/activities/1').length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Fails to delete activity log with error message. (from deleteActivityLog_editTrainingSessionLog)', async () => {
  fetchMock.delete('/activities/1', { status: 500, body: { message: 'Failed to delete activity' } });

  await act(async () => { render(<MemoryRouter><App activityId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/activities/1').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Edits a training session log successfully. (from deleteActivityLog_editTrainingSessionLog)', async () => {
  fetchMock.put('/training-sessions/1', { message: 'Training session updated' });

  await act(async () => { render(<MemoryRouter><App trainingId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('training-input'), { target: { value: 'Updated training' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/training-sessions/1').length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Fails to edit training session log with error message. (from deleteActivityLog_editTrainingSessionLog)', async () => {
  fetchMock.put('/training-sessions/1', { status: 500, body: { message: 'Failed to update training session' } });

  await act(async () => { render(<MemoryRouter><App trainingId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('training-input'), { target: { value: 'Updated training' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/training-sessions/1').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Add pet profile successfully. (from addPetProfile_reportAPost)', async () => {
  fetchMock.post('/api/pets', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/name/i), {target: {value: 'Fluffy'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Pet/i)); });

  expect(fetchMock.calls('/api/pets').length).toBe(1);
  expect(screen.getByText('Pet profile added successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to add pet profile due to missing name. (from addPetProfile_reportAPost)', async () => {
  fetchMock.post('/api/pets', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/name/i), {target: {value: ''}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Pet/i)); });

  expect(fetchMock.calls('/api/pets').length).toBe(1);
  expect(screen.getByText('Name is required.')).toBeInTheDocument();
}, 10000);

test('Successfully reports an inappropriate post (from addPetProfile_reportAPost)', async () => {
  fetchMock.post('/api/community/report', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('report-button', { name: /report/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post reported successfully')).toBeInTheDocument();
}, 10000);

test('Fails to report an inappropriate post (from addPetProfile_reportAPost)', async () => {
  fetchMock.post('/api/community/report', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('report-button', { name: /report/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to report post')).toBeInTheDocument();
}, 10000);


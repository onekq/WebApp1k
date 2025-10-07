import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editActivity_trackMoodChanges_caloriesBurned_logWeight';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can edit an existing fitness activity successfully. (from editActivity_trackMoodChanges)', async () => {
  fetchMock.put('/api/editActivity', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-name'), { target: { value: 'Updated Running' } });
    fireEvent.click(screen.getByTestId('submit-edit'));
  });

  expect(fetchMock.called('/api/editActivity')).toBeTruthy();
  expect(screen.getByText('Activity updated successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when editing a fitness activity fails. (from editActivity_trackMoodChanges)', async () => {
  fetchMock.put('/api/editActivity', { status: 500, body: { error: 'Failed to edit activity' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-name'), { target: { value: 'Updated Running' } });
    fireEvent.click(screen.getByTestId('submit-edit'));
  });

  expect(fetchMock.called('/api/editActivity')).toBeTruthy();
  expect(screen.getByText('Failed to edit activity')).toBeInTheDocument();
}, 10000);

test('System tracks mood changes over time related to workout intensity successfully. (from editActivity_trackMoodChanges)', async () => {
  fetchMock.get('/api/mood-changes', { data: 'Positive trend' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-mood')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Positive trend/)).toBeInTheDocument();
}, 10000);

test('System fails to track mood changes over time related to workout intensity. (from editActivity_trackMoodChanges)', async () => {
  fetchMock.get('/api/mood-changes', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-mood')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching mood changes/)).toBeInTheDocument();
}, 10000);

test('System calculates total calories burned in a week successfully. (from caloriesBurned_logWeight)', async () => {
  fetchMock.get('/api/total-calories', { calories: 5000 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-calories')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/5000 calories/)).toBeInTheDocument();
}, 10000);

test('System fails to calculate total calories burned in a week. (from caloriesBurned_logWeight)', async () => {
  fetchMock.get('/api/total-calories', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-calories')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching calories/)).toBeInTheDocument();
}, 10000);

test('logs weight successfully and displays weight in the list (from caloriesBurned_logWeight)', async () => {
  fetchMock.post('/api/log-weight', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter weight'), { target: { value: '70' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Weight')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Weight logged successfully!')).toBeInTheDocument();
}, 10000);

test('fails to log weight and displays an error message (from caloriesBurned_logWeight)', async () => {
  fetchMock.post('/api/log-weight', { status: 400, body: { error: 'Invalid weight' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter weight'), { target: { value: '-1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Weight')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log weight.')).toBeInTheDocument();
}, 10000);


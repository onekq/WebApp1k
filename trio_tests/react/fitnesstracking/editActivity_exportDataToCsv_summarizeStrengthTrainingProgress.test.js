import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editActivity_exportDataToCsv_summarizeStrengthTrainingProgress';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('User can edit an existing fitness activity successfully.', async () => {
  fetchMock.put('/api/editActivity', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><FitnessApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-name'), { target: { value: 'Updated Running' } });
    fireEvent.click(screen.getByTestId('submit-edit'));
  });

  expect(fetchMock.called('/api/editActivity')).toBeTruthy();
  expect(screen.getByText('Activity updated successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when editing a fitness activity fails.', async () => {
  fetchMock.put('/api/editActivity', { status: 500, body: { error: 'Failed to edit activity' } });

  await act(async () => {
    render(<MemoryRouter><FitnessApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-name'), { target: { value: 'Updated Running' } });
    fireEvent.click(screen.getByTestId('submit-edit'));
  });

  expect(fetchMock.called('/api/editActivity')).toBeTruthy();
  expect(screen.getByText('Failed to edit activity')).toBeInTheDocument();
}, 10000);

test('should export fitness data to CSV successfully.', async () => {
  fetchMock.get('/api/data/export', { status: 200, body: 'csv-data' });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('export-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/data/export')).toBe(true);
  expect(screen.getByText('Data exported successfully!')).toBeInTheDocument();
}, 10000);

test('should fail to export fitness data to CSV.', async () => {
  fetchMock.get('/api/data/export', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('export-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/data/export')).toBe(true);
  expect(screen.getByText('Export failed.')).toBeInTheDocument();
}, 10000);

test('should summarize strength training progress successfully.', async () => {
  fetchMock.get('/api/strength/progress', { status: 200, body: { progress: 'increased' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('summarize-progress-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/strength/progress')).toBe(true);
  expect(screen.getByText('Progress: increased')).toBeInTheDocument();
}, 10000);

test('should fail to summarize strength training progress.', async () => {
  fetchMock.get('/api/strength/progress', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('summarize-progress-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/strength/progress')).toBe(true);
  expect(screen.getByText('Failed to fetch progress.')).toBeInTheDocument();
}, 10000);

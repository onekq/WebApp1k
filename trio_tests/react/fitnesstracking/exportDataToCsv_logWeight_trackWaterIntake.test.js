import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './exportDataToCsv_logWeight_trackWaterIntake';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('logs weight successfully and displays weight in the list', async () => {
  fetchMock.post('/api/log-weight', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter weight'), { target: { value: '70' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Weight')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Weight logged successfully!')).toBeInTheDocument();
}, 10000);

test('fails to log weight and displays an error message', async () => {
  fetchMock.post('/api/log-weight', { status: 400, body: { error: 'Invalid weight' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter weight'), { target: { value: '-1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Weight')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log weight.')).toBeInTheDocument();
}, 10000);

test('tracks water intake successfully and displays progress', async () => {
  fetchMock.get('/api/track-water-intake', { status: 200, body: { progress: 80 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Daily water intake progress: 80%')).toBeInTheDocument();
}, 10000);

test('fails to track water intake and displays an error message', async () => {
  fetchMock.get('/api/track-water-intake', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to track water intake.')).toBeInTheDocument();
}, 10000);

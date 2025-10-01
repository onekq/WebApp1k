import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateDailyCalorieIntake_importDataFromCsv_logWaterIntake';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('calculates daily calorie intake successfully and displays calories', async () => {
  fetchMock.get('/api/calculate-calories', { status: 200, body: { calories: 2000 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total calories consumed: 2000')).toBeInTheDocument();
}, 10000);

test('fails to calculate daily calorie intake and displays an error message', async () => {
  fetchMock.get('/api/calculate-calories', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to calculate daily calorie intake.')).toBeInTheDocument();
}, 10000);

test('should import fitness data from CSV successfully.', async () => {
  fetchMock.post('/api/data/import', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('import-input'), { target: { value: 'csv-file-data' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('import-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/data/import')).toBe(true);
  expect(screen.getByText('Data imported successfully!')).toBeInTheDocument();
}, 10000);

test('should fail to import fitness data from CSV.', async () => {
  fetchMock.post('/api/data/import', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('import-input'), { target: { value: 'csv-file-data' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('import-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/data/import')).toBe(true);
  expect(screen.getByText('Import failed.')).toBeInTheDocument();
}, 10000);

test('logs water intake successfully and displays intake in the list', async () => {
  fetchMock.post('/api/log-water-intake', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter water intake'), { target: { value: '500' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Water')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Water logged successfully!')).toBeInTheDocument();
}, 10000);

test('fails to log water intake and displays an error message', async () => {
  fetchMock.post('/api/log-water-intake', { status: 400, body: { error: 'Invalid intake' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter water intake'), { target: { value: '-100' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Water')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log water intake.')).toBeInTheDocument();
}, 10000);

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateRemainingAmount_expenseImport_expenseTracking';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully calculates remaining amount to reach a financial goal', async () => {
  fetchMock.get('/api/goal/remaining/1', { status: 200, body: { remaining: 500 } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('$500 remaining to reach your goal!')).toBeInTheDocument();
}, 10000);

test('fails to calculate remaining amount to reach a financial goal', async () => {
  fetchMock.get('/api/goal/remaining/1', { status: 404, body: { error: 'Goal not found' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Goal not found')).toBeInTheDocument();
}, 10000);

test('Success: Import expenses from a CSV file.', async () => {
  fetchMock.post('/api/import-csv', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  const fileInput = screen.getByTestId('csv-file-input');
  const file = new File(['content'], 'expenses.csv', { type: 'text/csv' });

  await act(async () => {
    fireEvent.change(fileInput, { target: { files: [file] } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('import-csv-btn'));
  });

  expect(fetchMock.calls('/api/import-csv').length).toBe(1);
  expect(screen.getByText('CSV imported successfully!')).toBeInTheDocument();
}, 10000);

test('Failure: Import expenses from a CSV file.', async () => {
  fetchMock.post('/api/import-csv', { status: 400, body: { error: 'Invalid CSV file' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  const fileInput = screen.getByTestId('csv-file-input');
  const file = new File(['content'], 'expenses.csv', { type: 'text/csv' });

  await act(async () => {
    fireEvent.change(fileInput, { target: { files: [file] } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('import-csv-btn'));
  });

  expect(fetchMock.calls('/api/import-csv').length).toBe(1);
  expect(screen.getByText('Invalid CSV file')).toBeInTheDocument();
}, 10000);

test('Success: Track expenses by payment method.', async () => {
  fetchMock.get('/api/track-expense-by-method', { status: 200, body: { success: true, result: 'Credit: 400, Cash: 300' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('track-expense-method-btn'));
  });

  expect(fetchMock.calls('/api/track-expense-by-method').length).toBe(1);
  expect(screen.getByText('Tracking result: Credit: 400, Cash: 300')).toBeInTheDocument();
}, 10000);

test('Failure: Track expenses by payment method.', async () => {
  fetchMock.get('/api/track-expense-by-method', { status: 500, body: { error: 'Tracking error' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('track-expense-method-btn'));
  });

  expect(fetchMock.calls('/api/track-expense-by-method').length).toBe(1);
  expect(screen.getByText('Tracking error')).toBeInTheDocument();
}, 10000);

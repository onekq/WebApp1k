import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateExpense_expenseImport_trackFinancialGoal';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully calculates the percentage of expenses in each category', async () => {
  fetchMock.get('/api/expenses/categories', { status: 200, body: { percentages: { food: 30, entertainment: 20 } } });

  await act(async () => {
    render(<MemoryRouter><ExpenseCategories /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Food: 30%, Entertainment: 20%')).toBeInTheDocument();
}, 10000);

test('fails to calculate the percentage of expenses in each category', async () => {
  fetchMock.get('/api/expenses/categories', { status: 400, body: { error: 'Calculation error' } });

  await act(async () => {
    render(<MemoryRouter><ExpenseCategories /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Calculation error')).toBeInTheDocument();
}, 10000);

test('Success: Import expenses from a CSV file.', async () => {
  fetchMock.post('/api/import-csv', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><MyFinanceTool /></MemoryRouter>);
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
    render(<MemoryRouter><MyFinanceTool /></MemoryRouter>);
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

test('successfully tracks progress towards a financial goal', async () => {
  fetchMock.get('/api/goal/progress/1', { status: 200, body: { progress: 50 } });

  await act(async () => {
    render(<MemoryRouter><TrackProgress /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('track-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('50% towards your goal!')).toBeInTheDocument();
}, 10000);

test('fails to track progress towards a financial goal', async () => {
  fetchMock.get('/api/goal/progress/1', { status: 404, body: { error: 'Goal not found' } });

  await act(async () => {
    render(<MemoryRouter><TrackProgress /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('track-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Goal not found')).toBeInTheDocument();
}, 10000);

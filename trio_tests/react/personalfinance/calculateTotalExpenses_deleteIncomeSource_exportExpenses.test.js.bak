import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateTotalExpenses_deleteIncomeSource_exportExpenses';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Calculates total expenses for the given period successfully', async () => {
  fetchMock.post('/api/calculate-expenses', {
    body: { total: 1000 },
    headers: { 'content-type': 'application/json' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-total-expenses'), { target: { value: '2023-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-expenses-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total Expenses: 1000')).toBeInTheDocument();
}, 10000);

test('Fails to calculate total expenses due to invalid period format', async () => {
  fetchMock.post('/api/calculate-expenses', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-total-expenses'), { target: { value: 'invalid-period' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-expenses-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid period format')).toBeInTheDocument();
}, 10000);

test('successfully deletes an income source', async () => {
  fetchMock.delete('/income/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><DeleteIncome incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete income source/i));
  });

  expect(fetchMock.calls('/income/1')).toHaveLength(1);
  expect(screen.getByText(/income source deleted successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to delete an income source', async () => {
  fetchMock.delete('/income/1', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><DeleteIncome incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete income source/i));
  });

  expect(fetchMock.calls('/income/1')).toHaveLength(1);
  expect(screen.getByText(/failed to delete income source/i)).toBeInTheDocument();
}, 10000);

test('Exports expenses to a CSV file successfully', async () => {
  fetchMock.post('/api/export-csv', {
    body: { success: true },
    headers: { 'content-type': 'application/json' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('export-csv-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Export successful')).toBeInTheDocument();
}, 10000);

test('Fails to export expenses to a CSV file due to server error', async () => {
  fetchMock.post('/api/export-csv', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('export-csv-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Export failed')).toBeInTheDocument();
}, 10000);

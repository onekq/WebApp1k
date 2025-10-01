import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateTotalExpenses_exportIncome_incomeReport';

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

test('successfully exports income to a CSV file', async () => {
  fetchMock.post('/income/export', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/export to csv/i));
  });

  expect(fetchMock.calls('/income/export')).toHaveLength(1);
  expect(screen.getByText(/income exported successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to export income to a CSV file', async () => {
  fetchMock.post('/income/export', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/export to csv/i));
  });

  expect(fetchMock.calls('/income/export')).toHaveLength(1);
  expect(screen.getByText(/failed to export income/i)).toBeInTheDocument();
}, 10000);

test('Generates an income report for the given period successfully', async () => {
  fetchMock.post('/api/income-report', {
    body: { data: 'Income Report Data' },
    headers: { 'content-type': 'application/json' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-income'), { target: { value: '2023-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-income-report-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Income Report Data')).toBeInTheDocument();
}, 10000);

test('Fails to generate an income report due to invalid date format', async () => {
  fetchMock.post('/api/income-report', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-income'), { target: { value: 'invalid-date' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-income-report-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid date format')).toBeInTheDocument();
}, 10000);

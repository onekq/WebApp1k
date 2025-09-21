import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './expenseReport_incomeSummary_splitExpense';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Generates an expense report for the given period successfully', async () => {
  fetchMock.post('/api/expense-report', {
    body: { data: 'Expense Report Data' },
    headers: { 'content-type': 'application/json' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period'), { target: { value: '2023-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Expense Report Data')).toBeInTheDocument();
}, 10000);

test('Fails to generate an expense report due to missing period', async () => {
  fetchMock.post('/api/expense-report', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid period')).toBeInTheDocument();
}, 10000);

test('Generates a summary of income by source successfully', async () => {
  fetchMock.post('/api/income-summary', {
    body: { data: 'Income Summary Data' },
    headers: { 'content-type': 'application/json' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-income-summary'), { target: { value: '2023-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-income-summary-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Income Summary Data')).toBeInTheDocument();
}, 10000);

test('Fails to generate a summary of income due to missing data', async () => {
  fetchMock.post('/api/income-summary', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-income-summary'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-income-summary-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Missing data')).toBeInTheDocument();
}, 10000);

test('splits an expense into multiple categories successfully', async () => {
  fetchMock.post('/api/split-expense', { success: true });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('split-expense-input'), { target: { value: '150' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-split-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Expense split successfully!')).toBeInTheDocument();
}, 10000);

test('fails to split an expense into multiple categories', async () => {
  fetchMock.post('/api/split-expense', { success: false });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('split-expense-input'), { target: { value: '150' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-split-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error splitting expense.')).toBeInTheDocument();
}, 10000);

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './exportIncome_mergeExpenses_setMonthlyBudget';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully exports income to a CSV file', async () => {
  fetchMock.post('/income/export', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><ExportIncomeToCSV /></MemoryRouter>);
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
    render(<MemoryRouter><ExportIncomeToCSV /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/export to csv/i));
  });

  expect(fetchMock.calls('/income/export')).toHaveLength(1);
  expect(screen.getByText(/failed to export income/i)).toBeInTheDocument();
}, 10000);

test('merges multiple expenses into one successfully', async () => {
  fetchMock.post('/api/merge-expense', { success: true });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('merge-expense-input-1'), { target: { value: '300' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-merge-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Expenses merged successfully!')).toBeInTheDocument();
}, 10000);

test('fails to merge multiple expenses into one', async () => {
  fetchMock.post('/api/merge-expense', { success: false });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('merge-expense-input-1'), { target: { value: '300' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-merge-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error merging expenses.')).toBeInTheDocument();
}, 10000);

test('Success: Set a monthly budget for a category.', async () => {
  fetchMock.post('/api/set-budget', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><MyFinanceTool /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('category-input'), { target: { value: 'Groceries' } });
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('budget-input'), { target: { value: '500' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('set-budget-btn'));
  });

  expect(fetchMock.calls('/api/set-budget').length).toBe(1);
  expect(screen.getByText('Budget set successfully!')).toBeInTheDocument();
}, 10000);

test('Failure: Set a monthly budget for a category.', async () => {
  fetchMock.post('/api/set-budget', { status: 400, body: { error: 'Invalid budget' } });

  await act(async () => {
    render(<MemoryRouter><MyFinanceTool /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('category-input'), { target: { value: 'Groceries' } });
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('budget-input'), { target: { value: '500' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('set-budget-btn'));
  });

  expect(fetchMock.calls('/api/set-budget').length).toBe(1);
  expect(screen.getByText('Invalid budget')).toBeInTheDocument();
}, 10000);

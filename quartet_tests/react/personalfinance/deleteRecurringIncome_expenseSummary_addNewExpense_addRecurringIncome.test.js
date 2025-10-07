import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteRecurringIncome_expenseSummary_addNewExpense_addRecurringIncome';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully deletes a recurring income (from deleteRecurringIncome_expenseSummary)', async () => {
  fetchMock.delete('/income/recurring/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete recurring income/i));
  });

  expect(fetchMock.calls('/income/recurring/1')).toHaveLength(1);
  expect(screen.getByText(/recurring income deleted successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to delete a recurring income (from deleteRecurringIncome_expenseSummary)', async () => {
  fetchMock.delete('/income/recurring/1', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete recurring income/i));
  });

  expect(fetchMock.calls('/income/recurring/1')).toHaveLength(1);
  expect(screen.getByText(/failed to delete recurring income/i)).toBeInTheDocument();
}, 10000);

test('Success: Generate a summary of expenses by category. (from deleteRecurringIncome_expenseSummary)', async () => {
  fetchMock.get('/api/summary', { status: 200, body: { success: true, summary: 'Food: 500, Transport: 200' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-summary-btn'));
  });

  expect(fetchMock.calls('/api/summary').length).toBe(1);
  expect(screen.getByText('Summary generated: Food: 500, Transport: 200')).toBeInTheDocument();
}, 10000);

test('Failure: Generate a summary of expenses by category. (from deleteRecurringIncome_expenseSummary)', async () => {
  fetchMock.get('/api/summary', { status: 500, body: { error: 'Summary error' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-summary-btn'));
  });

  expect(fetchMock.calls('/api/summary').length).toBe(1);
  expect(screen.getByText('Summary error')).toBeInTheDocument();
}, 10000);

test('adds a new expense successfully (from addNewExpense_addRecurringIncome)', async () => {
  fetchMock.post('/api/expense', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Expense added successfully!')).toBeInTheDocument();
}, 10000);

test('fails to add a new expense (from addNewExpense_addRecurringIncome)', async () => {
  fetchMock.post('/api/expense', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error adding expense.')).toBeInTheDocument();
}, 10000);

test('successfully adds a recurring income (from addNewExpense_addRecurringIncome)', async () => {
  fetchMock.post('/income/recurring', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/source name/i), { target: { value: 'Monthly Salary' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/add recurring income/i));
  });

  expect(fetchMock.calls('/income/recurring')).toHaveLength(1);
  expect(screen.getByText(/recurring income added successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add a recurring income (from addNewExpense_addRecurringIncome)', async () => {
  fetchMock.post('/income/recurring', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/source name/i), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/add recurring income/i));
  });

  expect(fetchMock.calls('/income/recurring')).toHaveLength(1);
  expect(screen.getByText(/failed to add recurring income/i)).toBeInTheDocument();
}, 10000);


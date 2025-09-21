import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteExpense_deleteIncomeSource_editFinancialGoal';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('deletes an expense successfully', async () => {
  fetchMock.delete('/api/expense/1', { success: true });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Expense deleted successfully!')).toBeInTheDocument();
}, 10000);

test('fails to delete an expense', async () => {
  fetchMock.delete('/api/expense/1', { success: false });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error deleting expense.')).toBeInTheDocument();
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

test('successfully edits a financial goal', async () => {
  fetchMock.put('/api/goal/1', { status: 200, body: {} });

  await act(async () => {
    render(<MemoryRouter><EditFinancialGoal /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('goal-input-edit'), { target: { value: 'Save $1500' } });
    fireEvent.click(screen.getByTestId('edit-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Goal updated successfully!')).toBeInTheDocument();
}, 10000);

test('fails to edit a financial goal', async () => {
  fetchMock.put('/api/goal/1', { status: 400, body: { error: 'Invalid update' } });

  await act(async () => {
    render(<MemoryRouter><EditFinancialGoal /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('goal-input-edit'), { target: { value: '' } });
    fireEvent.click(screen.getByTestId('edit-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid update')).toBeInTheDocument();
}, 10000);

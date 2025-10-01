import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateIncomeSaving_editExistingExpense_setMonthlyBudget';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully calculates the percentage of income saved', async () => {
  fetchMock.get('/api/income/saved', { status: 200, body: { percentage: 20 } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('20% of income saved!')).toBeInTheDocument();
}, 10000);

test('fails to calculate the percentage of income saved', async () => {
  fetchMock.get('/api/income/saved', { status: 400, body: { error: 'Error calculating' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error calculating')).toBeInTheDocument();
}, 10000);

test('edits an existing expense successfully', async () => {
  fetchMock.put('/api/expense/1', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('expense-amount-input-1'), { target: { value: '200' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Expense updated successfully!')).toBeInTheDocument();
}, 10000);

test('fails to edit an existing expense', async () => {
  fetchMock.put('/api/expense/1', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('expense-amount-input-1'), { target: { value: '200' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error updating expense.')).toBeInTheDocument();
}, 10000);

test('Success: Set a monthly budget for a category.', async () => {
  fetchMock.post('/api/set-budget', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
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
    render(<MemoryRouter><App /></MemoryRouter>);
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

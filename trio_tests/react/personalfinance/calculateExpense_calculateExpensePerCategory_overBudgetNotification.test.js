import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateExpense_calculateExpensePerCategory_overBudgetNotification';

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

test('Success: Calculate the average expense per category for a given period.', async () => {
  fetchMock.get('/api/calculate-average', { status: 200, body: { average: 250 } });

  await act(async () => {
    render(<MemoryRouter><MyFinanceTool /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-average-btn'));
  });

  expect(fetchMock.calls('/api/calculate-average').length).toBe(1);
  expect(screen.getByText('Average expense: 250')).toBeInTheDocument();
}, 10000);

test('Failure: Calculate the average expense per category for a given period.', async () => {
  fetchMock.get('/api/calculate-average', { status: 400, body: { error: 'Calculation error' } });

  await act(async () => {
    render(<MemoryRouter><MyFinanceTool /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-average-btn'));
  });

  expect(fetchMock.calls('/api/calculate-average').length).toBe(1);
  expect(screen.getByText('Calculation error')).toBeInTheDocument();
}, 10000);

test('Success: Notify when an expense exceeds the budget for a category.', async () => {
  fetchMock.get('/api/check-expense-exceed', { status: 200, body: { exceeds: true } });

  await act(async () => {
    render(<MemoryRouter><MyFinanceTool /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('check-expense-exceed-btn'));
  });

  expect(fetchMock.calls('/api/check-expense-exceed').length).toBe(1);
  expect(screen.getByText('Expense exceeds budget!')).toBeInTheDocument();
}, 10000);

test('Failure: Notify when an expense exceeds the budget for a category.', async () => {
  fetchMock.get('/api/check-expense-exceed', { status: 200, body: { exceeds: false } });

  await act(async () => {
    render(<MemoryRouter><MyFinanceTool /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('check-expense-exceed-btn'));
  });

  expect(fetchMock.calls('/api/check-expense-exceed').length).toBe(1);
  expect(screen.getByText('Expense does not exceed budget.')).toBeInTheDocument();
}, 10000);

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addRecurringExpense_deleteRecurringIncome_expenseBudgetComparison';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('adds a recurring expense successfully', async () => {
  fetchMock.post('/api/recurring-expense', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurring-expense-input'), { target: { value: '50' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-recurring-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recurring expense added successfully!')).toBeInTheDocument();
}, 10000);

test('fails to add a recurring expense', async () => {
  fetchMock.post('/api/recurring-expense', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurring-expense-input'), { target: { value: '50' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-recurring-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error adding recurring expense.')).toBeInTheDocument();
}, 10000);

test('successfully deletes a recurring income', async () => {
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

test('fails to delete a recurring income', async () => {
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

test('Success: Compare expenses against the budget for a given period.', async () => {
  fetchMock.get('/api/compare-expense', { status: 200, body: { compared: true, result: 'Under budget' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('compare-expense-btn'));
  });

  expect(fetchMock.calls('/api/compare-expense').length).toBe(1);
  expect(screen.getByText('Compared successfully: Under budget')).toBeInTheDocument();
}, 10000);

test('Failure: Compare expenses against the budget for a given period.', async () => {
  fetchMock.get('/api/compare-expense', { status: 400, body: { error: 'Comparison failed' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('compare-expense-btn'));
  });

  expect(fetchMock.calls('/api/compare-expense').length).toBe(1);
  expect(screen.getByText('Comparison failed')).toBeInTheDocument();
}, 10000);

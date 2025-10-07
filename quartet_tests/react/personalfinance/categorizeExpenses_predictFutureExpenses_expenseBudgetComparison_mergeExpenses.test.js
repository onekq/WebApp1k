import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './categorizeExpenses_predictFutureExpenses_expenseBudgetComparison_mergeExpenses';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('categorizes expenses successfully (from categorizeExpenses_predictFutureExpenses)', async () => {
  fetchMock.post('/api/category', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('category-input'), { target: { value: 'Food' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-category-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Category added successfully!')).toBeInTheDocument();
}, 10000);

test('fails to categorize expenses (from categorizeExpenses_predictFutureExpenses)', async () => {
  fetchMock.post('/api/category', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('category-input'), { target: { value: 'Food' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-category-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error adding category.')).toBeInTheDocument();
}, 10000);

test('Success: Predict future expenses based on past data. (from categorizeExpenses_predictFutureExpenses)', async () => {
  fetchMock.post('/api/predict-expense', { status: 200, body: { success: true, prediction: 300 } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('predict-expense-btn'));
  });

  expect(fetchMock.calls('/api/predict-expense').length).toBe(1);
  expect(screen.getByText('Predicted future expense: 300')).toBeInTheDocument();
}, 10000);

test('Failure: Predict future expenses based on past data. (from categorizeExpenses_predictFutureExpenses)', async () => {
  fetchMock.post('/api/predict-expense', { status: 500, body: { error: 'Prediction error' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('predict-expense-btn'));
  });

  expect(fetchMock.calls('/api/predict-expense').length).toBe(1);
  expect(screen.getByText('Prediction error')).toBeInTheDocument();
}, 10000);

test('Success: Compare expenses against the budget for a given period. (from expenseBudgetComparison_mergeExpenses)', async () => {
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

test('Failure: Compare expenses against the budget for a given period. (from expenseBudgetComparison_mergeExpenses)', async () => {
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

test('merges multiple expenses into one successfully (from expenseBudgetComparison_mergeExpenses)', async () => {
  fetchMock.post('/api/merge-expense', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('merge-expense-input-1'), { target: { value: '300' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-merge-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Expenses merged successfully!')).toBeInTheDocument();
}, 10000);

test('fails to merge multiple expenses into one (from expenseBudgetComparison_mergeExpenses)', async () => {
  fetchMock.post('/api/merge-expense', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('merge-expense-input-1'), { target: { value: '300' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-merge-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error merging expenses.')).toBeInTheDocument();
}, 10000);


import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addIncomeSource_editMonthlyBudget_predictFutureExpenses';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully adds a new income source', async () => {
  fetchMock.post('/income', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/source name/i), { target: { value: 'Salary' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/add income/i));
  });

  expect(fetchMock.calls('/income')).toHaveLength(1);
  expect(screen.getByText(/income source added successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add a new income source', async () => {
  fetchMock.post('/income', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/source name/i), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/add income/i));
  });

  expect(fetchMock.calls('/income')).toHaveLength(1);
  expect(screen.getByText(/failed to add income source/i)).toBeInTheDocument();
}, 10000);

test('Success: Edit a monthly budget.', async () => {
  fetchMock.put('/api/edit-budget', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('category-input'), { target: { value: 'Groceries' } });
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('budget-input'), { target: { value: '600' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('edit-budget-btn'));
  });

  expect(fetchMock.calls('/api/edit-budget').length).toBe(1);
  expect(screen.getByText('Budget updated successfully!')).toBeInTheDocument();
}, 10000);

test('Failure: Edit a monthly budget.', async () => {
  fetchMock.put('/api/edit-budget', { status: 400, body: { error: 'Budget not found' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('category-input'), { target: { value: 'Groceries' } });
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('budget-input'), { target: { value: '600' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('edit-budget-btn'));
  });

  expect(fetchMock.calls('/api/edit-budget').length).toBe(1);
  expect(screen.getByText('Budget not found')).toBeInTheDocument();
}, 10000);

test('Success: Predict future expenses based on past data.', async () => {
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

test('Failure: Predict future expenses based on past data.', async () => {
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

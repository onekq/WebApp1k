import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editMonthlyBudget_expenseTracking_netBalanceReport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('Success: Track expenses by payment method.', async () => {
  fetchMock.get('/api/track-expense-by-method', { status: 200, body: { success: true, result: 'Credit: 400, Cash: 300' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('track-expense-method-btn'));
  });

  expect(fetchMock.calls('/api/track-expense-by-method').length).toBe(1);
  expect(screen.getByText('Tracking result: Credit: 400, Cash: 300')).toBeInTheDocument();
}, 10000);

test('Failure: Track expenses by payment method.', async () => {
  fetchMock.get('/api/track-expense-by-method', { status: 500, body: { error: 'Tracking error' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('track-expense-method-btn'));
  });

  expect(fetchMock.calls('/api/track-expense-by-method').length).toBe(1);
  expect(screen.getByText('Tracking error')).toBeInTheDocument();
}, 10000);

test('Generates a net balance report for the given period successfully', async () => {
  fetchMock.post('/api/net-balance-report', {
    body: { data: 'Net Balance Report Data' },
    headers: { 'content-type': 'application/json' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-balance'), { target: { value: '2023-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-balance-report-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Net Balance Report Data')).toBeInTheDocument();
}, 10000);

test('Fails to generate a net balance report due to invalid period', async () => {
  fetchMock.post('/api/net-balance-report', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-balance'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-balance-report-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid period')).toBeInTheDocument();
}, 10000);

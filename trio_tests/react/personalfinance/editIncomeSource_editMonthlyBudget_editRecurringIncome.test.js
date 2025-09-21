import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editIncomeSource_editMonthlyBudget_editRecurringIncome';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully edits an existing income source', async () => {
  fetchMock.put('/income/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><EditIncome incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/source name/i), { target: { value: 'Updated Salary' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/save changes/i));
  });

  expect(fetchMock.calls('/income/1')).toHaveLength(1);
  expect(screen.getByText(/income source updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to edit an existing income source', async () => {
  fetchMock.put('/income/1', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><EditIncome incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/source name/i), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/save changes/i));
  });

  expect(fetchMock.calls('/income/1')).toHaveLength(1);
  expect(screen.getByText(/failed to update income source/i)).toBeInTheDocument();
}, 10000);

test('Success: Edit a monthly budget.', async () => {
  fetchMock.put('/api/edit-budget', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><MyFinanceTool /></MemoryRouter>);
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
    render(<MemoryRouter><MyFinanceTool /></MemoryRouter>);
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

test('successfully edits a recurring income', async () => {
  fetchMock.put('/income/recurring/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><EditRecurringIncome incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/source name/i), { target: { value: 'Updated Salary' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/save changes/i));
  });

  expect(fetchMock.calls('/income/recurring/1')).toHaveLength(1);
  expect(screen.getByText(/recurring income updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to edit a recurring income', async () => {
  fetchMock.put('/income/recurring/1', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><EditRecurringIncome incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/source name/i), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/save changes/i));
  });

  expect(fetchMock.calls('/income/recurring/1')).toHaveLength(1);
  expect(screen.getByText(/failed to update recurring income/i)).toBeInTheDocument();
}, 10000);

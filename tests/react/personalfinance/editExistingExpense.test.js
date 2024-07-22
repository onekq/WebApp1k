import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ExpenseManager from './editExistingExpense';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('edits an existing expense successfully', async () => {
  fetchMock.put('/api/expense/1', { success: true });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('expense-amount-input-1'), { target: { value: '200' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Expense updated successfully!')).toBeInTheDocument();
}, 10000);

test('fails to edit an existing expense', async () => {
  fetchMock.put('/api/expense/1', { success: false });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('expense-amount-input-1'), { target: { value: '200' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error updating expense.')).toBeInTheDocument();
}, 10000);


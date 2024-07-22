import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ExpenseManager from './addRecurringExpense';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('adds a recurring expense successfully', async () => {
  fetchMock.post('/api/recurring-expense', { success: true });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurring-expense-input'), { target: { value: '50' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-recurring-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recurring expense added successfully!')).toBeInTheDocument();
}, 10000);

test('fails to add a recurring expense', async () => {
  fetchMock.post('/api/recurring-expense', { success: false });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurring-expense-input'), { target: { value: '50' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-recurring-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error adding recurring expense.')).toBeInTheDocument();
}, 10000);


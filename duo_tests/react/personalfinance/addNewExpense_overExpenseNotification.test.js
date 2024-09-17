import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addNewExpense_overApp';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('adds a new expense successfully', async () => {
  fetchMock.post('/api/expense', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Expense added successfully!')).toBeInTheDocument();
}, 10000);

test('fails to add a new expense', async () => {
  fetchMock.post('/api/expense', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error adding expense.')).toBeInTheDocument();
}, 10000);

test('successfully notifies when expenses exceed income for a given period', async () => {
  fetchMock.get('/api/expenses/notification', { status: 200, body: { notify: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('notify-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Expenses exceed income!')).toBeInTheDocument();
}, 10000);

test('fails to notify when expenses exceed income for a given period', async () => {
  fetchMock.get('/api/expenses/notification', { status: 200, body: { notify: false } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('notify-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No notification needed.')).toBeInTheDocument();
}, 10000);
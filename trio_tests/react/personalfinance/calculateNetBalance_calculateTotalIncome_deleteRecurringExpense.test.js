import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateNetBalance_calculateTotalIncome_deleteRecurringExpense';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Calculates net balance for the given period successfully', async () => {
  fetchMock.post('/api/calculate-net-balance', {
    body: { balance: 1000 },
    headers: { 'content-type': 'application/json' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-net-balance'), { target: { value: '2023-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-net-balance-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Net Balance: 1000')).toBeInTheDocument();
}, 10000);

test('Fails to calculate net balance due to missing period', async () => {
  fetchMock.post('/api/calculate-net-balance', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-net-balance'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-net-balance-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Missing period')).toBeInTheDocument();
}, 10000);

test('Calculates total income for the given period successfully', async () => {
  fetchMock.post('/api/calculate-income', {
    body: { total: 2000 },
    headers: { 'content-type': 'application/json' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-total-income'), { target: { value: '2023-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-income-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total Income: 2000')).toBeInTheDocument();
}, 10000);

test('Fails to calculate total income due to missing period', async () => {
  fetchMock.post('/api/calculate-income', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-total-income'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-income-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Missing period')).toBeInTheDocument();
}, 10000);

test('deletes a recurring expense successfully', async () => {
  fetchMock.delete('/api/recurring-expense/1', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-recurring-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recurring expense deleted successfully!')).toBeInTheDocument();
}, 10000);

test('fails to delete a recurring expense', async () => {
  fetchMock.delete('/api/recurring-expense/1', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-recurring-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error deleting recurring expense.')).toBeInTheDocument();
}, 10000);

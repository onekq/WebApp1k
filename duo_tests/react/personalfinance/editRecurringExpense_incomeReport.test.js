import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editRecurringExpense_incomeReport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('edits a recurring expense successfully', async () => {
  fetchMock.put('/api/recurring-expense/1', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurring-expense-input-1'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-recurring-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recurring expense updated successfully!')).toBeInTheDocument();
}, 10000);

test('fails to edit a recurring expense', async () => {
  fetchMock.put('/api/recurring-expense/1', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurring-expense-input-1'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-recurring-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error updating recurring expense.')).toBeInTheDocument();
}, 10000);

test('Generates an income report for the given period successfully', async () => {
  fetchMock.post('/api/income-report', {
    body: { data: 'Income Report Data' },
    headers: { 'content-type': 'application/json' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-income'), { target: { value: '2023-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-income-report-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Income Report Data')).toBeInTheDocument();
}, 10000);

test('Fails to generate an income report due to invalid date format', async () => {
  fetchMock.post('/api/income-report', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-income'), { target: { value: 'invalid-date' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-income-report-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid date format')).toBeInTheDocument();
}, 10000);
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addNewExpense_incomeReport_tagIncomeSources';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('adds a new expense successfully', async () => {
  fetchMock.post('/api/expense', { success: true });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Expense added successfully!')).toBeInTheDocument();
}, 10000);

test('fails to add a new expense', async () => {
  fetchMock.post('/api/expense', { success: false });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error adding expense.')).toBeInTheDocument();
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

test('successfully assigns tags to an income source', async () => {
  fetchMock.post('/income/1/tags', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><AssignTags incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/tags/i), { target: { value: 'Bonus,Part-time' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/assign tags/i));
  });

  expect(fetchMock.calls('/income/1/tags')).toHaveLength(1);
  expect(screen.getByText(/tags assigned successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to assign tags to an income source', async () => {
  fetchMock.post('/income/1/tags', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><AssignTags incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/tags/i), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/assign tags/i));
  });

  expect(fetchMock.calls('/income/1/tags')).toHaveLength(1);
  expect(screen.getByText(/failed to assign tags/i)).toBeInTheDocument();
}, 10000);

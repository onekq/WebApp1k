import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteRecurringExpense_expenseSummary';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('Success: Generate a summary of expenses by category.', async () => {
  fetchMock.get('/api/summary', { status: 200, body: { success: true, summary: 'Food: 500, Transport: 200' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-summary-btn'));
  });

  expect(fetchMock.calls('/api/summary').length).toBe(1);
  expect(screen.getByText('Summary generated: Food: 500, Transport: 200')).toBeInTheDocument();
}, 10000);

test('Failure: Generate a summary of expenses by category.', async () => {
  fetchMock.get('/api/summary', { status: 500, body: { error: 'Summary error' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-summary-btn'));
  });

  expect(fetchMock.calls('/api/summary').length).toBe(1);
  expect(screen.getByText('Summary error')).toBeInTheDocument();
}, 10000);
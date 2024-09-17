import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteRecurringIncome_expenseSummary';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully deletes a recurring income', async () => {
  fetchMock.delete('/income/recurring/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete recurring income/i));
  });

  expect(fetchMock.calls('/income/recurring/1')).toHaveLength(1);
  expect(screen.getByText(/recurring income deleted successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to delete a recurring income', async () => {
  fetchMock.delete('/income/recurring/1', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete recurring income/i));
  });

  expect(fetchMock.calls('/income/recurring/1')).toHaveLength(1);
  expect(screen.getByText(/failed to delete recurring income/i)).toBeInTheDocument();
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
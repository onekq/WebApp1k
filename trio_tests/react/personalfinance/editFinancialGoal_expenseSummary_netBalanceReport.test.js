import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editFinancialGoal_expenseSummary_netBalanceReport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully edits a financial goal', async () => {
  fetchMock.put('/api/goal/1', { status: 200, body: {} });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('goal-input-edit'), { target: { value: 'Save $1500' } });
    fireEvent.click(screen.getByTestId('edit-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Goal updated successfully!')).toBeInTheDocument();
}, 10000);

test('fails to edit a financial goal', async () => {
  fetchMock.put('/api/goal/1', { status: 400, body: { error: 'Invalid update' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('goal-input-edit'), { target: { value: '' } });
    fireEvent.click(screen.getByTestId('edit-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid update')).toBeInTheDocument();
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

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyFinanceTool from './expenseBudgetComparison';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: Compare expenses against the budget for a given period.', async () => {
  fetchMock.get('/api/compare-expense', { status: 200, body: { compared: true, result: 'Under budget' } });

  await act(async () => {
    render(<MemoryRouter><MyFinanceTool /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('compare-expense-btn'));
  });

  expect(fetchMock.calls('/api/compare-expense').length).toBe(1);
  expect(screen.getByText('Compared successfully: Under budget')).toBeInTheDocument();
}, 10000);

test('Failure: Compare expenses against the budget for a given period.', async () => {
  fetchMock.get('/api/compare-expense', { status: 400, body: { error: 'Comparison failed' } });

  await act(async () => {
    render(<MemoryRouter><MyFinanceTool /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('compare-expense-btn'));
  });

  expect(fetchMock.calls('/api/compare-expense').length).toBe(1);
  expect(screen.getByText('Comparison failed')).toBeInTheDocument();
}, 10000);

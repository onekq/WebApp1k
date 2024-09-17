import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './overBudgetNotification_overApp';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: Notify when an expense exceeds the budget for a category.', async () => {
  fetchMock.get('/api/check-expense-exceed', { status: 200, body: { exceeds: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('check-expense-exceed-btn'));
  });

  expect(fetchMock.calls('/api/check-expense-exceed').length).toBe(1);
  expect(screen.getByText('Expense exceeds budget!')).toBeInTheDocument();
}, 10000);

test('Failure: Notify when an expense exceeds the budget for a category.', async () => {
  fetchMock.get('/api/check-expense-exceed', { status: 200, body: { exceeds: false } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('check-expense-exceed-btn'));
  });

  expect(fetchMock.calls('/api/check-expense-exceed').length).toBe(1);
  expect(screen.getByText('Expense does not exceed budget.')).toBeInTheDocument();
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
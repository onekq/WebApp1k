import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyFinanceTool from './setMonthlyBudget';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: Set a monthly budget for a category.', async () => {
  fetchMock.post('/api/set-budget', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><MyFinanceTool /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('category-input'), { target: { value: 'Groceries' } });
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('budget-input'), { target: { value: '500' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('set-budget-btn'));
  });

  expect(fetchMock.calls('/api/set-budget').length).toBe(1);
  expect(screen.getByText('Budget set successfully!')).toBeInTheDocument();
}, 10000);

test('Failure: Set a monthly budget for a category.', async () => {
  fetchMock.post('/api/set-budget', { status: 400, body: { error: 'Invalid budget' } });

  await act(async () => {
    render(<MemoryRouter><MyFinanceTool /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('category-input'), { target: { value: 'Groceries' } });
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('budget-input'), { target: { value: '500' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('set-budget-btn'));
  });

  expect(fetchMock.calls('/api/set-budget').length).toBe(1);
  expect(screen.getByText('Invalid budget')).toBeInTheDocument();
}, 10000);


import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './categorizeIcomeSource_editMonthlyBudget';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully categorizes an income source', async () => {
  fetchMock.post('/income/1/categorize', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Job' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/categorize income source/i));
  });

  expect(fetchMock.calls('/income/1/categorize')).toHaveLength(1);
  expect(screen.getByText(/income source categorized successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to categorize an income source', async () => {
  fetchMock.post('/income/1/categorize', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/categorize income source/i));
  });

  expect(fetchMock.calls('/income/1/categorize')).toHaveLength(1);
  expect(screen.getByText(/failed to categorize income source/i)).toBeInTheDocument();
}, 10000);

test('Success: Edit a monthly budget.', async () => {
  fetchMock.put('/api/edit-budget', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('category-input'), { target: { value: 'Groceries' } });
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('budget-input'), { target: { value: '600' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('edit-budget-btn'));
  });

  expect(fetchMock.calls('/api/edit-budget').length).toBe(1);
  expect(screen.getByText('Budget updated successfully!')).toBeInTheDocument();
}, 10000);

test('Failure: Edit a monthly budget.', async () => {
  fetchMock.put('/api/edit-budget', { status: 400, body: { error: 'Budget not found' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('category-input'), { target: { value: 'Groceries' } });
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('budget-input'), { target: { value: '600' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('edit-budget-btn'));
  });

  expect(fetchMock.calls('/api/edit-budget').length).toBe(1);
  expect(screen.getByText('Budget not found')).toBeInTheDocument();
}, 10000);
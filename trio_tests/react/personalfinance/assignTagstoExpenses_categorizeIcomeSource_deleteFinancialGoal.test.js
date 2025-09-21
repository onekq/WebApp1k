import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './assignTagstoExpenses_categorizeIcomeSource_deleteFinancialGoal';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('assigns tags to expenses successfully', async () => {
  fetchMock.post('/api/tag', { success: true });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input'), { target: { value: 'Groceries' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-tag-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Tag added successfully!')).toBeInTheDocument();
}, 10000);

test('fails to assign tags to expenses', async () => {
  fetchMock.post('/api/tag', { success: false });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input'), { target: { value: 'Groceries' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-tag-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error adding tag.')).toBeInTheDocument();
}, 10000);

test('successfully categorizes an income source', async () => {
  fetchMock.post('/income/1/categorize', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><CategorizeIncome incomeId={1} /></MemoryRouter>);
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
    render(<MemoryRouter><CategorizeIncome incomeId={1} /></MemoryRouter>);
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

test('successfully deletes a financial goal', async () => {
  fetchMock.delete('/api/goal/1', { status: 200, body: {} });

  await act(async () => {
    render(<MemoryRouter><DeleteFinancialGoal /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Goal deleted successfully!')).toBeInTheDocument();
}, 10000);

test('fails to delete a financial goal', async () => {
  fetchMock.delete('/api/goal/1', { status: 404, body: { error: 'Goal not found' } });

  await act(async () => {
    render(<MemoryRouter><DeleteFinancialGoal /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Goal not found')).toBeInTheDocument();
}, 10000);

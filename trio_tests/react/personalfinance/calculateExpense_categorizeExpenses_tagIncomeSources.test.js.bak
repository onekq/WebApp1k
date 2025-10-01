import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateExpense_categorizeExpenses_tagIncomeSources';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully calculates the percentage of expenses in each category', async () => {
  fetchMock.get('/api/expenses/categories', { status: 200, body: { percentages: { food: 30, entertainment: 20 } } });

  await act(async () => {
    render(<MemoryRouter><ExpenseCategories /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Food: 30%, Entertainment: 20%')).toBeInTheDocument();
}, 10000);

test('fails to calculate the percentage of expenses in each category', async () => {
  fetchMock.get('/api/expenses/categories', { status: 400, body: { error: 'Calculation error' } });

  await act(async () => {
    render(<MemoryRouter><ExpenseCategories /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Calculation error')).toBeInTheDocument();
}, 10000);

test('categorizes expenses successfully', async () => {
  fetchMock.post('/api/category', { success: true });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('category-input'), { target: { value: 'Food' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-category-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Category added successfully!')).toBeInTheDocument();
}, 10000);

test('fails to categorize expenses', async () => {
  fetchMock.post('/api/category', { success: false });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('category-input'), { target: { value: 'Food' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-category-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error adding category.')).toBeInTheDocument();
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

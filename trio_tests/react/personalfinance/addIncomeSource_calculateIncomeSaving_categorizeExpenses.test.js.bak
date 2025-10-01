import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addIncomeSource_calculateIncomeSaving_categorizeExpenses';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully adds a new income source', async () => {
  fetchMock.post('/income', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><AddIncome /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/source name/i), { target: { value: 'Salary' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/add income/i));
  });

  expect(fetchMock.calls('/income')).toHaveLength(1);
  expect(screen.getByText(/income source added successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add a new income source', async () => {
  fetchMock.post('/income', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><AddIncome /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/source name/i), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/add income/i));
  });

  expect(fetchMock.calls('/income')).toHaveLength(1);
  expect(screen.getByText(/failed to add income source/i)).toBeInTheDocument();
}, 10000);

test('successfully calculates the percentage of income saved', async () => {
  fetchMock.get('/api/income/saved', { status: 200, body: { percentage: 20 } });

  await act(async () => {
    render(<MemoryRouter><IncomeSaved /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('20% of income saved!')).toBeInTheDocument();
}, 10000);

test('fails to calculate the percentage of income saved', async () => {
  fetchMock.get('/api/income/saved', { status: 400, body: { error: 'Error calculating' } });

  await act(async () => {
    render(<MemoryRouter><IncomeSaved /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error calculating')).toBeInTheDocument();
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

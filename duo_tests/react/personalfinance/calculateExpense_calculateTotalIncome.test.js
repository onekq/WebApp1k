import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateExpense_calculateTotalIncome';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully calculates the percentage of expenses in each category', async () => {
  fetchMock.get('/api/expenses/categories', { status: 200, body: { percentages: { food: 30, entertainment: 20 } } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
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
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Calculation error')).toBeInTheDocument();
}, 10000);

test('Calculates total income for the given period successfully', async () => {
  fetchMock.post('/api/calculate-income', {
    body: { total: 2000 },
    headers: { 'content-type': 'application/json' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-total-income'), { target: { value: '2023-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-income-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total Income: 2000')).toBeInTheDocument();
}, 10000);

test('Fails to calculate total income due to missing period', async () => {
  fetchMock.post('/api/calculate-income', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-total-income'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-income-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Missing period')).toBeInTheDocument();
}, 10000);
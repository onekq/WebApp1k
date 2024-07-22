import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './expenseReport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Generates an expense report for the given period successfully', async () => {
  fetchMock.post('/api/expense-report', {
    body: { data: 'Expense Report Data' },
    headers: { 'content-type': 'application/json' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period'), { target: { value: '2023-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Expense Report Data')).toBeInTheDocument();
}, 10000);

test('Fails to generate an expense report due to missing period', async () => {
  fetchMock.post('/api/expense-report', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid period')).toBeInTheDocument();
}, 10000);


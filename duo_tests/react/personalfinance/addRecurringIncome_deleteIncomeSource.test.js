import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addRecurringIncome_deleteIncomeSource';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds a recurring income', async () => {
  fetchMock.post('/income/recurring', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/source name/i), { target: { value: 'Monthly Salary' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/add recurring income/i));
  });

  expect(fetchMock.calls('/income/recurring')).toHaveLength(1);
  expect(screen.getByText(/recurring income added successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add a recurring income', async () => {
  fetchMock.post('/income/recurring', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/source name/i), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/add recurring income/i));
  });

  expect(fetchMock.calls('/income/recurring')).toHaveLength(1);
  expect(screen.getByText(/failed to add recurring income/i)).toBeInTheDocument();
}, 10000);

test('successfully deletes an income source', async () => {
  fetchMock.delete('/income/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete income source/i));
  });

  expect(fetchMock.calls('/income/1')).toHaveLength(1);
  expect(screen.getByText(/income source deleted successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to delete an income source', async () => {
  fetchMock.delete('/income/1', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete income source/i));
  });

  expect(fetchMock.calls('/income/1')).toHaveLength(1);
  expect(screen.getByText(/failed to delete income source/i)).toBeInTheDocument();
}, 10000);
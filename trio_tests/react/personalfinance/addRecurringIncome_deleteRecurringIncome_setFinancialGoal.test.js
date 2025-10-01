import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addRecurringIncome_deleteRecurringIncome_setFinancialGoal';

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

test('successfully deletes a recurring income', async () => {
  fetchMock.delete('/income/recurring/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete recurring income/i));
  });

  expect(fetchMock.calls('/income/recurring/1')).toHaveLength(1);
  expect(screen.getByText(/recurring income deleted successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to delete a recurring income', async () => {
  fetchMock.delete('/income/recurring/1', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete recurring income/i));
  });

  expect(fetchMock.calls('/income/recurring/1')).toHaveLength(1);
  expect(screen.getByText(/failed to delete recurring income/i)).toBeInTheDocument();
}, 10000);

test('successfully sets a new financial goal', async () => {
  fetchMock.post('/api/goal', { status: 201, body: {} });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('goal-input'), { target: { value: 'Save $1000' } });
    fireEvent.click(screen.getByTestId('submit-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Goal set successfully!')).toBeInTheDocument();
}, 10000);

test('fails to set a new financial goal', async () => {
  fetchMock.post('/api/goal', { status: 400, body: { error: 'Invalid goal' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('goal-input'), { target: { value: '' } });
    fireEvent.click(screen.getByTestId('submit-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid goal')).toBeInTheDocument();
}, 10000);

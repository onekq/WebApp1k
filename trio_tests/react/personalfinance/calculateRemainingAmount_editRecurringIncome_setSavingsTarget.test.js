import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateRemainingAmount_editRecurringIncome_setSavingsTarget';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully calculates remaining amount to reach a financial goal', async () => {
  fetchMock.get('/api/goal/remaining/1', { status: 200, body: { remaining: 500 } });

  await act(async () => {
    render(<MemoryRouter><CalculateRemaining /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('$500 remaining to reach your goal!')).toBeInTheDocument();
}, 10000);

test('fails to calculate remaining amount to reach a financial goal', async () => {
  fetchMock.get('/api/goal/remaining/1', { status: 404, body: { error: 'Goal not found' } });

  await act(async () => {
    render(<MemoryRouter><CalculateRemaining /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Goal not found')).toBeInTheDocument();
}, 10000);

test('successfully edits a recurring income', async () => {
  fetchMock.put('/income/recurring/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><EditRecurringIncome incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/source name/i), { target: { value: 'Updated Salary' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/save changes/i));
  });

  expect(fetchMock.calls('/income/recurring/1')).toHaveLength(1);
  expect(screen.getByText(/recurring income updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to edit a recurring income', async () => {
  fetchMock.put('/income/recurring/1', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><EditRecurringIncome incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/source name/i), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/save changes/i));
  });

  expect(fetchMock.calls('/income/recurring/1')).toHaveLength(1);
  expect(screen.getByText(/failed to update recurring income/i)).toBeInTheDocument();
}, 10000);

test('successfully sets savings targets', async () => {
  fetchMock.post('/api/savings/target', { status: 201, body: {} });

  await act(async () => {
    render(<MemoryRouter><SetSavingsTarget /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('target-input'), { target: { value: 'Save $2000' } });
    fireEvent.click(screen.getByTestId('submit-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Savings target set successfully!')).toBeInTheDocument();
}, 10000);

test('fails to set savings targets', async () => {
  fetchMock.post('/api/savings/target', { status: 400, body: { error: 'Invalid target' } });

  await act(async () => {
    render(<MemoryRouter><SetSavingsTarget /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('target-input'), { target: { value: '' } });
    fireEvent.click(screen.getByTestId('submit-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid target')).toBeInTheDocument();
}, 10000);

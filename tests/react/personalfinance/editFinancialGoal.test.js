import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import EditFinancialGoal from './editFinancialGoal';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully edits a financial goal', async () => {
  fetchMock.put('/api/goal/1', { status: 200, body: {} });

  await act(async () => {
    render(<MemoryRouter><EditFinancialGoal /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('goal-input-edit'), { target: { value: 'Save $1500' } });
    fireEvent.click(screen.getByTestId('edit-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Goal updated successfully!')).toBeInTheDocument();
}, 10000);

test('fails to edit a financial goal', async () => {
  fetchMock.put('/api/goal/1', { status: 400, body: { error: 'Invalid update' } });

  await act(async () => {
    render(<MemoryRouter><EditFinancialGoal /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('goal-input-edit'), { target: { value: '' } });
    fireEvent.click(screen.getByTestId('edit-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid update')).toBeInTheDocument();
}, 10000);


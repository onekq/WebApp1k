import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SetFinancialGoal from './setFinancialGoal';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully sets a new financial goal', async () => {
  fetchMock.post('/api/goal', { status: 201, body: {} });

  await act(async () => {
    render(<MemoryRouter><SetFinancialGoal /></MemoryRouter>);
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
    render(<MemoryRouter><SetFinancialGoal /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('goal-input'), { target: { value: '' } });
    fireEvent.click(screen.getByTestId('submit-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid goal')).toBeInTheDocument();
}, 10000);


import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './categorizeIcomeSource_compareIncomeAgainstGoal';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully categorizes an income source', async () => {
  fetchMock.post('/income/1/categorize', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
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
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
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

test('Compares income against a goal for the given period successfully', async () => {
  fetchMock.post('/api/compare-income-goal', {
    body: { result: 'Goal Met' },
    headers: { 'content-type': 'application/json' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-income-goal'), { target: { value: '2023-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('compare-income-goal-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Goal Met')).toBeInTheDocument();
}, 10000);

test('Fails to compare income against a goal due to server error', async () => {
  fetchMock.post('/api/compare-income-goal', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-income-goal'), { target: { value: '2023-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('compare-income-goal-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server error')).toBeInTheDocument();
}, 10000);
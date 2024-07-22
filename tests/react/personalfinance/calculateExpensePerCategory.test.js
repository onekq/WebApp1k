import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyFinanceTool from './calculateExpensePerCategory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: Calculate the average expense per category for a given period.', async () => {
  fetchMock.get('/api/calculate-average', { status: 200, body: { average: 250 } });

  await act(async () => {
    render(<MemoryRouter><MyFinanceTool /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-average-btn'));
  });

  expect(fetchMock.calls('/api/calculate-average').length).toBe(1);
  expect(screen.getByText('Average expense: 250')).toBeInTheDocument();
}, 10000);

test('Failure: Calculate the average expense per category for a given period.', async () => {
  fetchMock.get('/api/calculate-average', { status: 400, body: { error: 'Calculation error' } });

  await act(async () => {
    render(<MemoryRouter><MyFinanceTool /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-average-btn'));
  });

  expect(fetchMock.calls('/api/calculate-average').length).toBe(1);
  expect(screen.getByText('Calculation error')).toBeInTheDocument();
}, 10000);


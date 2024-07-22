import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import DeleteRecurringIncome from './deleteRecurringIncome';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully deletes a recurring income', async () => {
  fetchMock.delete('/income/recurring/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><DeleteRecurringIncome incomeId={1} /></MemoryRouter>);
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
    render(<MemoryRouter><DeleteRecurringIncome incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete recurring income/i));
  });

  expect(fetchMock.calls('/income/recurring/1')).toHaveLength(1);
  expect(screen.getByText(/failed to delete recurring income/i)).toBeInTheDocument();
}, 10000);


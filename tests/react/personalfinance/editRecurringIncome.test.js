import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import EditRecurringIncome from './editRecurringIncome';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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


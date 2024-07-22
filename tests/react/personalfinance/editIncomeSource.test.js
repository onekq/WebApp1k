import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import EditIncome from './editIncomeSource';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully edits an existing income source', async () => {
  fetchMock.put('/income/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><EditIncome incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/source name/i), { target: { value: 'Updated Salary' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/save changes/i));
  });

  expect(fetchMock.calls('/income/1')).toHaveLength(1);
  expect(screen.getByText(/income source updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to edit an existing income source', async () => {
  fetchMock.put('/income/1', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><EditIncome incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/source name/i), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/save changes/i));
  });

  expect(fetchMock.calls('/income/1')).toHaveLength(1);
  expect(screen.getByText(/failed to update income source/i)).toBeInTheDocument();
}, 10000);


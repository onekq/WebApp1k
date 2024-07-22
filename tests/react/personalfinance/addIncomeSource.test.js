import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import AddIncome from './addIncomeSource';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds a new income source', async () => {
  fetchMock.post('/income', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><AddIncome /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/source name/i), { target: { value: 'Salary' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/add income/i));
  });

  expect(fetchMock.calls('/income')).toHaveLength(1);
  expect(screen.getByText(/income source added successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add a new income source', async () => {
  fetchMock.post('/income', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><AddIncome /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/source name/i), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/add income/i));
  });

  expect(fetchMock.calls('/income')).toHaveLength(1);
  expect(screen.getByText(/failed to add income source/i)).toBeInTheDocument();
}, 10000);


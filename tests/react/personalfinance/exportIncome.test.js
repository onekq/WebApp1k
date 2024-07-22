import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ExportIncomeToCSV from './exportIncome';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully exports income to a CSV file', async () => {
  fetchMock.post('/income/export', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><ExportIncomeToCSV /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/export to csv/i));
  });

  expect(fetchMock.calls('/income/export')).toHaveLength(1);
  expect(screen.getByText(/income exported successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to export income to a CSV file', async () => {
  fetchMock.post('/income/export', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><ExportIncomeToCSV /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/export to csv/i));
  });

  expect(fetchMock.calls('/income/export')).toHaveLength(1);
  expect(screen.getByText(/failed to export income/i)).toBeInTheDocument();
}, 10000);
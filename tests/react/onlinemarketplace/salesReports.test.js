import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './salesReports';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully generates sales reports.', async () => {
  const mockReportData = { report: 'Sales Report Data' };
  fetchMock.get('/api/sales-report', { status: 200, body: mockReportData });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sales Report Data')).toBeInTheDocument();
}, 10000);

test('fails to generate sales reports with an error message.', async () => {
  fetchMock.get('/api/sales-report', { status: 400, body: { error: 'Failed to generate report' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to generate report')).toBeInTheDocument();
}, 10000);


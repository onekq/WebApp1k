import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './autoResponseSending_reportExport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully sends auto-responses based on ticket content.', async () => {
  fetchMock.post('/api/sendAutoResponse', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketContent'), { target: { value: 'Issue' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send Auto-Response')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Auto-response sent')).toBeInTheDocument();
}, 10000);

test('Fails to send auto-responses based on ticket content.', async () => {
  fetchMock.post('/api/sendAutoResponse', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketContent'), { target: { value: 'Issue' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send Auto-Response')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to send auto-response')).toBeInTheDocument();
}, 10000);

test('Successfully exports reports to CSV.', async () => {
  fetchMock.post('/api/report/export', {
    status: 200,
    body: { success: true },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('report-type-picker'), { target: { value: 'csv' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('export-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Export successful')).toBeInTheDocument();
}, 10000);

test('Fails to export reports to CSV and shows error message.', async () => {
  fetchMock.post('/api/report/export', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('report-type-picker'), { target: { value: 'csv' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('export-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);
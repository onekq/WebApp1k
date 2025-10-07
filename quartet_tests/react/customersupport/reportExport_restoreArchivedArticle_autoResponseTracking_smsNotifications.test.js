import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './reportExport_restoreArchivedArticle_autoResponseTracking_smsNotifications';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully exports reports to CSV. (from reportExport_restoreArchivedArticle)', async () => {
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

test('Fails to export reports to CSV and shows error message. (from reportExport_restoreArchivedArticle)', async () => {
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

test('successfully restores archived articles (from reportExport_restoreArchivedArticle)', async () => {
  fetchMock.post('path/to/api/article/restore', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('restore-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('fails to restore archived articles with error message (from reportExport_restoreArchivedArticle)', async () => {
  fetchMock.post('path/to/api/article/restore', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('restore-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Successfully tracks the use of auto-responses. (from autoResponseTracking_smsNotifications)', async () => {
  fetchMock.get('/api/getAutoResponseUsage', { usage: '10 times' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('10 times')).toBeInTheDocument();
}, 10000);

test('Fails to track the use of auto-responses. (from autoResponseTracking_smsNotifications)', async () => {
  fetchMock.get('/api/getAutoResponseUsage', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to track usage')).toBeInTheDocument();
}, 10000);

test('Successfully sends SMS notifications for urgent updates. (from autoResponseTracking_smsNotifications)', async () => {
  fetchMock.post('/api/sendSms', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketId'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send SMS')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('SMS sent')).toBeInTheDocument();
}, 10000);

test('Fails to send SMS notifications for urgent updates. (from autoResponseTracking_smsNotifications)', async () => {
  fetchMock.post('/api/sendSms', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketId'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send SMS')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to send SMS')).toBeInTheDocument();
}, 10000);


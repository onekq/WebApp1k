import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './emailNotifications_inAppNotifications_reportExport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully sends email notifications for ticket updates.', async () => {
  fetchMock.post('/api/sendEmail', 200);

  await act(async () => { render(<MemoryRouter><EmailNotifications /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketId'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send Notification')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Notification sent')).toBeInTheDocument();
}, 10000);

test('Fails to send email notifications for ticket updates.', async () => {
  fetchMock.post('/api/sendEmail', 500);

  await act(async () => { render(<MemoryRouter><EmailNotifications /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketId'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send Notification')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to send notification')).toBeInTheDocument();
}, 10000);

test('Successfully displays in-app notifications.', async () => {
  fetchMock.get('/api/getNotifications', { notifications: ['Notification 1'] });

  await act(async () => { render(<MemoryRouter><InAppNotifications /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Notification 1')).toBeInTheDocument();
}, 10000);

test('Fails to display in-app notifications.', async () => {
  fetchMock.get('/api/getNotifications', 500);

  await act(async () => { render(<MemoryRouter><InAppNotifications /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load notifications')).toBeInTheDocument();
}, 10000);

test('Successfully exports reports to CSV.', async () => {
  fetchMock.post('/api/report/export', {
    status: 200,
    body: { success: true },
  });

  await act(async () => {
    render(<MemoryRouter><ExportingReports /></MemoryRouter>);
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
    render(<MemoryRouter><ExportingReports /></MemoryRouter>);
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

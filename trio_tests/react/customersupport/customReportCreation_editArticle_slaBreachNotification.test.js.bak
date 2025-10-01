import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customReportCreation_editArticle_slaBreachNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully creates custom reports.', async () => {
  fetchMock.post('/api/report/custom', {
    status: 200,
    body: { success: true, data: { reportId: '123' }},
  });

  await act(async () => {
    render(<MemoryRouter><CustomReportCreation /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('report-name-input'), { target: { value: 'Test Report' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('create-custom-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Report created')).toBeInTheDocument();
}, 10000);

test('Fails to create custom reports and shows error message.', async () => {
  fetchMock.post('/api/report/custom', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><CustomReportCreation /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('report-name-input'), { target: { value: 'Test Report' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('create-custom-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('successfully edits existing articles', async () => {
  fetchMock.put('path/to/api/article', 200);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('article-input'), { target: { value: 'Updated Article' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('edit-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('fails to edit existing articles with error message', async () => {
  fetchMock.put('path/to/api/article', 500);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('article-input'), { target: { value: 'Updated Article' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('edit-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Successfully notifies agents of SLA breaches.', async () => {
  fetchMock.post('/api/report/sla-breach-notification', {
    status: 200,
    body: { success: true },
  });

  await act(async () => {
    render(<MemoryRouter><SLABreachNotification /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('sla-breach-picker'), { target: { value: 'breach1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('notify-sla-breach'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Notification sent')).toBeInTheDocument();
}, 10000);

test('Fails to notify agents of SLA breaches and shows error message.', async () => {
  fetchMock.post('/api/report/sla-breach-notification', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><SLABreachNotification /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('sla-breach-picker'), { target: { value: 'breach1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('notify-sla-breach'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

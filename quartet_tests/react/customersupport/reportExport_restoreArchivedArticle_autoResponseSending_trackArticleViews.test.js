import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './reportExport_restoreArchivedArticle_autoResponseSending_trackArticleViews';

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

test('Successfully sends auto-responses based on ticket content. (from autoResponseSending_trackArticleViews)', async () => {
  fetchMock.post('/api/sendAutoResponse', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketContent'), { target: { value: 'Issue' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send Auto-Response')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Auto-response sent')).toBeInTheDocument();
}, 10000);

test('Fails to send auto-responses based on ticket content. (from autoResponseSending_trackArticleViews)', async () => {
  fetchMock.post('/api/sendAutoResponse', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketContent'), { target: { value: 'Issue' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send Auto-Response')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to send auto-response')).toBeInTheDocument();
}, 10000);

test('successfully tracks the number of views for an article (from autoResponseSending_trackArticleViews)', async () => {
  fetchMock.get('path/to/api/article/views', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('view-count')).toBeInTheDocument();
}, 10000);

test('fails to track the number of views for an article with error message (from autoResponseSending_trackArticleViews)', async () => {
  fetchMock.get('path/to/api/article/views', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);


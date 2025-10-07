import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './agentPerformanceTracking_suggestArticles_restoreArchivedArticle_slaBreachNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully tracks agent performance metrics. (from agentPerformanceTracking_suggestArticles)', async () => {
  fetchMock.post('/api/report/agent-performance', {
    status: 200,
    body: { success: true, data: { performance: 'good' }},
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('agent-picker'), { target: { value: 'agent2' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('track-performance'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Performance: good')).toBeInTheDocument();
}, 10000);

test('Fails to track agent performance metrics and shows error message. (from agentPerformanceTracking_suggestArticles)', async () => {
  fetchMock.post('/api/report/agent-performance', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('agent-picker'), { target: { value: 'agent2' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('track-performance'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('successfully suggests articles based on ticket content (from agentPerformanceTracking_suggestArticles)', async () => {
  fetchMock.post('path/to/api/article/suggest', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('suggest-articles-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('suggested-articles-list')).toBeInTheDocument();
}, 10000);

test('fails to suggest articles based on ticket content with error message (from agentPerformanceTracking_suggestArticles)', async () => {
  fetchMock.post('path/to/api/article/suggest', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('suggest-articles-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('successfully restores archived articles (from restoreArchivedArticle_slaBreachNotification)', async () => {
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

test('fails to restore archived articles with error message (from restoreArchivedArticle_slaBreachNotification)', async () => {
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

test('Successfully notifies agents of SLA breaches. (from restoreArchivedArticle_slaBreachNotification)', async () => {
  fetchMock.post('/api/report/sla-breach-notification', {
    status: 200,
    body: { success: true },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
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

test('Fails to notify agents of SLA breaches and shows error message. (from restoreArchivedArticle_slaBreachNotification)', async () => {
  fetchMock.post('/api/report/sla-breach-notification', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
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


import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './responseHistory_responseTimeAnalysis_searchArticles';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Tracking the history of responses should show response history.', async () => {
  fetchMock.get('/api/response-history', { history: ['Initial response', 'Follow-up response'] });

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-history'), { target: { value: 'history123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-history')); });

  expect(fetchMock.calls('/api/response-history').length).toBe(1);
  expect(screen.getByText('Initial response')).toBeInTheDocument();
}, 10000);

test('Tracking the history of responses should show error message when failed.', async () => {
  fetchMock.get('/api/response-history', 500);

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-history'), { target: { value: 'history123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-history')); });

  expect(fetchMock.calls('/api/response-history').length).toBe(1);
  expect(screen.getByText('Failed to retrieve response history')).toBeInTheDocument();
}, 10000);

test('Successfully analyzes average response time.', async () => {
  fetchMock.post('/api/report/response-time', {
    status: 200,
    body: { success: true, data: { avgResponseTime: 120 }},
  });

  await act(async () => {
    render(<MemoryRouter><ResponseTimeAnalysis /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('agent-picker'), { target: { value: 'agent1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('analyze-response-time'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Average Response Time: 120')).toBeInTheDocument();
}, 10000);

test('Fails to analyze average response time and shows error message.', async () => {
  fetchMock.post('/api/report/response-time', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><ResponseTimeAnalysis /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('agent-picker'), { target: { value: 'agent1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('analyze-response-time'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('successfully searches for articles in the knowledge base', async () => {
  fetchMock.get('path/to/api/articles?search=term', 200);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'term' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('search-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('articles-list')).toBeInTheDocument();
}, 10000);

test('fails to search for articles in the knowledge base with error message', async () => {
  fetchMock.get('path/to/api/articles?search=term', 500);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'term' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('search-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

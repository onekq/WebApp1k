import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addArticle_responseTimeAnalysis_ticketStatusChange';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully adds new articles', async () => {
  fetchMock.post('path/to/api/article', 201);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('article-input'), { target: { value: 'New Article' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('add-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('fails to add new articles with error message', async () => {
  fetchMock.post('path/to/api/article', 500);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('article-input'), { target: { value: 'New Article' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('add-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
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

test('successfully changes the status of a ticket', async () => {
  fetchMock.put('/api/tickets/1/status', { status: 200 });
  
  await act(async () => { render(<MemoryRouter><TicketStatusChange ticketId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Resolved' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Status')); });
  
  expect(fetchMock.calls('/api/tickets/1/status').length).toBe(1);
  expect(screen.getByText('Status updated successfully!')).toBeInTheDocument();
}, 10000);

test('shows error if changing status fails', async () => {
  fetchMock.put('/api/tickets/1/status', 500);
  
  await act(async () => { render(<MemoryRouter><TicketStatusChange ticketId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Resolved' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Status')); });
  
  expect(fetchMock.calls('/api/tickets/1/status').length).toBe(1);
  expect(screen.getByText('Failed to update status')).toBeInTheDocument();
}, 10000);

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './responseTimeAnalysis_suggestArticles_ticketPrioritization';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('successfully suggests articles based on ticket content', async () => {
  fetchMock.post('path/to/api/article/suggest', 200);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('suggest-articles-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('suggested-articles-list')).toBeInTheDocument();
}, 10000);

test('fails to suggest articles based on ticket content with error message', async () => {
  fetchMock.post('path/to/api/article/suggest', 500);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('suggest-articles-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('successfully sets ticket priority', async () => {
  fetchMock.post('/api/tickets', { status: 200 });
  
  await act(async () => { render(<MemoryRouter><TicketSubmission /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'High' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets')[0][1].body).toContain('High');
  expect(screen.getByText('Ticket submitted successfully!')).toBeInTheDocument();
}, 10000);

test('shows error if setting priority fails', async () => {
  fetchMock.post('/api/tickets', 500);
  
  await act(async () => { render(<MemoryRouter><TicketSubmission /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'High' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Failed to set ticket priority')).toBeInTheDocument();
}, 10000);

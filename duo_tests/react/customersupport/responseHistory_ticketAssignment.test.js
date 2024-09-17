import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './responseHistory_ticketAssignment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Tracking the history of responses should show response history.', async () => {
  fetchMock.get('/api/response-history', { history: ['Initial response', 'Follow-up response'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-history'), { target: { value: 'history123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-history')); });

  expect(fetchMock.calls('/api/response-history').length).toBe(1);
  expect(screen.getByText('Initial response')).toBeInTheDocument();
}, 10000);

test('Tracking the history of responses should show error message when failed.', async () => {
  fetchMock.get('/api/response-history', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-history'), { target: { value: 'history123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-history')); });

  expect(fetchMock.calls('/api/response-history').length).toBe(1);
  expect(screen.getByText('Failed to retrieve response history')).toBeInTheDocument();
}, 10000);

test('Automatically assigning ticket to available agent should show success message.', async () => {
  fetchMock.post('/api/assign-ticket', { agent: 'John Doe' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('new-ticket'), { target: { value: 'Issue description' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-ticket')); });

  expect(fetchMock.calls('/api/assign-ticket').length).toBe(1);
  expect(screen.getByText('Assignment to John Doe successful')).toBeInTheDocument();
}, 10000);

test('Automatically assigning ticket to available agent should show error message when failed.', async () => {
  fetchMock.post('/api/assign-ticket', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('new-ticket'), { target: { value: 'Issue description' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-ticket')); });

  expect(fetchMock.calls('/api/assign-ticket').length).toBe(1);
  expect(screen.getByText('Ticket assignment failed')).toBeInTheDocument();
}, 10000);
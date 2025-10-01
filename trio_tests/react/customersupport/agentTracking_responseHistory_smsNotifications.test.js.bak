import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './agentTracking_responseHistory_smsNotifications';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Tracking the agent assigned to a ticket should show agent name.', async () => {
  fetchMock.post('/api/track-agent', { agent: 'James Bond' });

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-id-track'), { target: { value: '789' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('track-agent')); });

  expect(fetchMock.calls('/api/track-agent').length).toBe(1);
  expect(screen.getByText('Assigned to: James Bond')).toBeInTheDocument();
}, 10000);

test('Tracking the agent assigned to a ticket should show error message when failed.', async () => {
  fetchMock.post('/api/track-agent', 500);

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-id-track'), { target: { value: '789' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('track-agent')); });

  expect(fetchMock.calls('/api/track-agent').length).toBe(1);
  expect(screen.getByText('Agent tracking failed')).toBeInTheDocument();
}, 10000);

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

test('Successfully sends SMS notifications for urgent updates.', async () => {
  fetchMock.post('/api/sendSms', 200);

  await act(async () => { render(<MemoryRouter><SmsNotifications /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketId'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send SMS')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('SMS sent')).toBeInTheDocument();
}, 10000);

test('Fails to send SMS notifications for urgent updates.', async () => {
  fetchMock.post('/api/sendSms', 500);

  await act(async () => { render(<MemoryRouter><SmsNotifications /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketId'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send SMS')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to send SMS')).toBeInTheDocument();
}, 10000);

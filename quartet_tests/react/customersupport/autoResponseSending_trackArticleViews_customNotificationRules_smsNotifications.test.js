import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './autoResponseSending_trackArticleViews_customNotificationRules_smsNotifications';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('Successfully creates custom notification rules. (from customNotificationRules_smsNotifications)', async () => {
  fetchMock.post('/api/createCustomNotificationRule', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ruleContent'), { target: { value: 'Rule' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Rule')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Rule created')).toBeInTheDocument();
}, 10000);

test('Fails to create custom notification rules. (from customNotificationRules_smsNotifications)', async () => {
  fetchMock.post('/api/createCustomNotificationRule', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ruleContent'), { target: { value: 'Rule' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Rule')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to create rule')).toBeInTheDocument();
}, 10000);

test('Successfully sends SMS notifications for urgent updates. (from customNotificationRules_smsNotifications)', async () => {
  fetchMock.post('/api/sendSms', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketId'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send SMS')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('SMS sent')).toBeInTheDocument();
}, 10000);

test('Fails to send SMS notifications for urgent updates. (from customNotificationRules_smsNotifications)', async () => {
  fetchMock.post('/api/sendSms', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketId'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send SMS')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to send SMS')).toBeInTheDocument();
}, 10000);


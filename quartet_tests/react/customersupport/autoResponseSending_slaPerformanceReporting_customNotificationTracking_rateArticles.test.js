import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './autoResponseSending_slaPerformanceReporting_customNotificationTracking_rateArticles';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully sends auto-responses based on ticket content. (from autoResponseSending_slaPerformanceReporting)', async () => {
  fetchMock.post('/api/sendAutoResponse', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketContent'), { target: { value: 'Issue' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send Auto-Response')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Auto-response sent')).toBeInTheDocument();
}, 10000);

test('Fails to send auto-responses based on ticket content. (from autoResponseSending_slaPerformanceReporting)', async () => {
  fetchMock.post('/api/sendAutoResponse', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketContent'), { target: { value: 'Issue' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send Auto-Response')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to send auto-response')).toBeInTheDocument();
}, 10000);

test('Successfully reports on SLA performance. (from autoResponseSending_slaPerformanceReporting)', async () => {
  fetchMock.post('/api/report/sla-performance', {
    status: 200,
    body: { success: true, data: { slaPerformance: 'Good' }},
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('sla-picker'), { target: { value: 'sla1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-sla-performance-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('SLA Performance: Good')).toBeInTheDocument();
}, 10000);

test('Fails to report on SLA performance and shows error message. (from autoResponseSending_slaPerformanceReporting)', async () => {
  fetchMock.post('/api/report/sla-performance', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('sla-picker'), { target: { value: 'sla1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-sla-performance-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Successfully tracks custom notification delivery. (from customNotificationTracking_rateArticles)', async () => {
  fetchMock.get('/api/getCustomNotificationDelivery', { deliveryStatus: 'Success' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Success')).toBeInTheDocument();
}, 10000);

test('Fails to track custom notification delivery. (from customNotificationTracking_rateArticles)', async () => {
  fetchMock.get('/api/getCustomNotificationDelivery', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to track delivery')).toBeInTheDocument();
}, 10000);

test('successfully rates articles for helpfulness (from customNotificationTracking_rateArticles)', async () => {
  fetchMock.post('path/to/api/article/rate', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('rate-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('thank-you-message')).toBeInTheDocument();
}, 10000);

test('fails to rate articles for helpfulness with error message (from customNotificationTracking_rateArticles)', async () => {
  fetchMock.post('path/to/api/article/rate', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('rate-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);


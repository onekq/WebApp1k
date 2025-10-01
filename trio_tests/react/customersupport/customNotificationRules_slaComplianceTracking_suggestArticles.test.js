import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customNotificationRules_slaComplianceTracking_suggestArticles';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully creates custom notification rules.', async () => {
  fetchMock.post('/api/createCustomNotificationRule', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ruleContent'), { target: { value: 'Rule' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Rule')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Rule created')).toBeInTheDocument();
}, 10000);

test('Fails to create custom notification rules.', async () => {
  fetchMock.post('/api/createCustomNotificationRule', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ruleContent'), { target: { value: 'Rule' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Rule')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to create rule')).toBeInTheDocument();
}, 10000);

test('Successfully tracks SLA compliance.', async () => {
  fetchMock.post('/api/report/sla-compliance', {
    status: 200,
    body: { success: true, data: { complianceRate: 0.85 }},
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2022-03-01' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('track-sla-compliance'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('SLA Compliance: 85%')).toBeInTheDocument();
}, 10000);

test('Fails to track SLA compliance and shows error message.', async () => {
  fetchMock.post('/api/report/sla-compliance', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2022-03-01' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('track-sla-compliance'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('successfully suggests articles based on ticket content', async () => {
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

test('fails to suggest articles based on ticket content with error message', async () => {
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

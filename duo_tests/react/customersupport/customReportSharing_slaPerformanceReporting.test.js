import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customReportSharing_slaPerformanceReporting';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully shares custom reports.', async () => {
  fetchMock.post('/api/report/custom/share', {
    status: 200,
    body: { success: true },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('share-email-input'), { target: { value: 'user@test.com' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('share-custom-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Report shared')).toBeInTheDocument();
}, 10000);

test('Fails to share custom reports and shows error message.', async () => {
  fetchMock.post('/api/report/custom/share', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('share-email-input'), { target: { value: 'user@test.com' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('share-custom-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Successfully reports on SLA performance.', async () => {
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

test('Fails to report on SLA performance and shows error message.', async () => {
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
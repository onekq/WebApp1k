import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './categorizeArticles_customReportCreation_notificationDeliveryTracking';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully categorizes articles by topic', async () => {
  fetchMock.get('path/to/api/articles?category=topic', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('category-select'), { target: { value: 'topic' } });
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('articles-list')).toBeInTheDocument();
}, 10000);

test('fails to categorize articles by topic with error message', async () => {
  fetchMock.get('path/to/api/articles?category=topic', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('category-select'), { target: { value: 'topic' } });
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Successfully creates custom reports.', async () => {
  fetchMock.post('/api/report/custom', {
    status: 200,
    body: { success: true, data: { reportId: '123' }},
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('report-name-input'), { target: { value: 'Test Report' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('create-custom-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Report created')).toBeInTheDocument();
}, 10000);

test('Fails to create custom reports and shows error message.', async () => {
  fetchMock.post('/api/report/custom', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('report-name-input'), { target: { value: 'Test Report' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('create-custom-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Successfully tracks delivery status of notifications.', async () => {
  fetchMock.get('/api/getDeliveryStatus', { status: 'Delivered' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Delivered')).toBeInTheDocument();
}, 10000);

test('Fails to track delivery status of notifications.', async () => {
  fetchMock.get('/api/getDeliveryStatus', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to track delivery status')).toBeInTheDocument();
}, 10000);

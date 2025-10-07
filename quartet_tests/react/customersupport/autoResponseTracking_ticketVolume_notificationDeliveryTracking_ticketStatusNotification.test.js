import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './autoResponseTracking_ticketVolume_notificationDeliveryTracking_ticketStatusNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully tracks the use of auto-responses. (from autoResponseTracking_ticketVolume)', async () => {
  fetchMock.get('/api/getAutoResponseUsage', { usage: '10 times' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('10 times')).toBeInTheDocument();
}, 10000);

test('Fails to track the use of auto-responses. (from autoResponseTracking_ticketVolume)', async () => {
  fetchMock.get('/api/getAutoResponseUsage', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to track usage')).toBeInTheDocument();
}, 10000);

test('Successfully generates reports on ticket volume. (from autoResponseTracking_ticketVolume)', async () => {
  fetchMock.post('/api/report/ticket-volume', {
    status: 200,
    body: { success: true },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2022-01-01' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('report-result')).toBeInTheDocument();
}, 10000);

test('Fails to generate reports on ticket volume and shows error message. (from autoResponseTracking_ticketVolume)', async () => {
  fetchMock.post('/api/report/ticket-volume', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2022-01-01' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Successfully tracks delivery status of notifications. (from notificationDeliveryTracking_ticketStatusNotification)', async () => {
  fetchMock.get('/api/getDeliveryStatus', { status: 'Delivered' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Delivered')).toBeInTheDocument();
}, 10000);

test('Fails to track delivery status of notifications. (from notificationDeliveryTracking_ticketStatusNotification)', async () => {
  fetchMock.get('/api/getDeliveryStatus', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to track delivery status')).toBeInTheDocument();
}, 10000);

test('notifies the user of a ticket status change (from notificationDeliveryTracking_ticketStatusNotification)', async () => {
  fetchMock.put('/api/tickets/1/notify', { status: 200 });
  
  await act(async () => { render(<MemoryRouter><App ticketId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Notify')); });
  
  expect(fetchMock.calls('/api/tickets/1/notify').length).toBe(1);
  expect(screen.getByText('User notified successfully!')).toBeInTheDocument();
}, 10000);

test('shows error if notification fails (from notificationDeliveryTracking_ticketStatusNotification)', async () => {
  fetchMock.put('/api/tickets/1/notify', 500);
  
  await act(async () => { render(<MemoryRouter><App ticketId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Notify')); });
  
  expect(fetchMock.calls('/api/tickets/1/notify').length).toBe(1);
  expect(screen.getByText('Failed to notify user')).toBeInTheDocument();
}, 10000);


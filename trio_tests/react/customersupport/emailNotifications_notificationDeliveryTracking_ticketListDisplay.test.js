import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './emailNotifications_notificationDeliveryTracking_ticketListDisplay';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully sends email notifications for ticket updates.', async () => {
  fetchMock.post('/api/sendEmail', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketId'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send Notification')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Notification sent')).toBeInTheDocument();
}, 10000);

test('Fails to send email notifications for ticket updates.', async () => {
  fetchMock.post('/api/sendEmail', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketId'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send Notification')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to send notification')).toBeInTheDocument();
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

test('displays a list of tickets with their current status', async () => {
  fetchMock.get('/api/tickets', { status: 200, body: [{ id: 1, status: 'Open' }, { id: 2, status: 'Resolved' }] });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Open')).toBeInTheDocument();
  expect(screen.getByText('Resolved')).toBeInTheDocument();
}, 10000);

test('shows error if fetching ticket list fails', async () => {
  fetchMock.get('/api/tickets', 500);
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Failed to fetch ticket list')).toBeInTheDocument();
}, 10000);

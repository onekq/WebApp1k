import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './autoResponseTracking_smsNotifications';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully tracks the use of auto-responses.', async () => {
  fetchMock.get('/api/getAutoResponseUsage', { usage: '10 times' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('10 times')).toBeInTheDocument();
}, 10000);

test('Fails to track the use of auto-responses.', async () => {
  fetchMock.get('/api/getAutoResponseUsage', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to track usage')).toBeInTheDocument();
}, 10000);

test('Successfully sends SMS notifications for urgent updates.', async () => {
  fetchMock.post('/api/sendSms', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketId'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send SMS')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('SMS sent')).toBeInTheDocument();
}, 10000);

test('Fails to send SMS notifications for urgent updates.', async () => {
  fetchMock.post('/api/sendSms', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketId'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send SMS')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to send SMS')).toBeInTheDocument();
}, 10000);
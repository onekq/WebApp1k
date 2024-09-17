import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customNotificationRules_smsNotifications';

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
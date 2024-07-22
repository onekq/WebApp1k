import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SLABreachNotification from './slaBreachNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully notifies agents of SLA breaches.', async () => {
  fetchMock.post('/api/report/sla-breach-notification', {
    status: 200,
    body: { success: true },
  });

  await act(async () => {
    render(<MemoryRouter><SLABreachNotification /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('sla-breach-picker'), { target: { value: 'breach1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('notify-sla-breach'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Notification sent')).toBeInTheDocument();
}, 10000);

test('Fails to notify agents of SLA breaches and shows error message.', async () => {
  fetchMock.post('/api/report/sla-breach-notification', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><SLABreachNotification /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('sla-breach-picker'), { target: { value: 'breach1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('notify-sla-breach'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);


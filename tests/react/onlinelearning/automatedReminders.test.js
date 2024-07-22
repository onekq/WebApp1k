import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import AutomatedReminders from './automatedReminders';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully sends automated reminders for deadlines', async () => {
  fetchMock.post('/reminders', { status: 200 });

  await act(async () => { render(<MemoryRouter><AutomatedReminders /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Send Reminders')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Reminders sent')).toBeInTheDocument();
}, 10000);

test('Fails to send automated reminders for deadlines', async () => {
  fetchMock.post('/reminders', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><AutomatedReminders /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Send Reminders')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Reminders failed')).toBeInTheDocument();
}, 10000);


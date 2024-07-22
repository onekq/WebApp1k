import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './validateSessionReminders';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully validates session reminders.', async () => {
  fetchMock.post('/api/validateSessionReminders', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-reminders-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Reminders set')).toBeInTheDocument();
}, 10000);

test('Fails to validate session reminders.', async () => {
  fetchMock.post('/api/validateSessionReminders', { error: 'Failed to set reminders' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-reminders-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to set reminders')).toBeInTheDocument();
}, 10000);
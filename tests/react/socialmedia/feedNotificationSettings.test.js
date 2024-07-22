import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import NotificationSettingsComponent from './feedNotificationSettings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully updates feed notification settings.', async () => {
  fetchMock.post('/api/notification-settings', {
    status: 200, body: { message: 'Settings updated' }
  });

  await act(async () => {
    render(<MemoryRouter><NotificationSettingsComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText('Notify for specific users'), { target: { value: 'user1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save Settings'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Settings updated')).toBeInTheDocument();
}, 10000);

test('Shows error message when updating feed notification settings fails.', async () => {
  fetchMock.post('/api/notification-settings', {
    status: 500, body: { message: 'Failed to update settings' }
  });

  await act(async () => {
    render(<MemoryRouter><NotificationSettingsComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText('Notify for specific users'), { target: { value: 'user1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save Settings'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update settings')).toBeInTheDocument();
}, 10000);


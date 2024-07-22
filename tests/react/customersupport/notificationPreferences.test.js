import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import NotificationPreferences from './notificationPreferences';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully customizes notification preferences.', async () => {
  fetchMock.post('/api/savePreferences', 200);

  await act(async () => { render(<MemoryRouter><NotificationPreferences /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('emailToggle'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Preferences')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Preferences saved')).toBeInTheDocument();
}, 10000);

test('Fails to customize notification preferences.', async () => {
  fetchMock.post('/api/savePreferences', 500);

  await act(async () => { render(<MemoryRouter><NotificationPreferences /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('emailToggle'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Preferences')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save preferences')).toBeInTheDocument();
}, 10000);


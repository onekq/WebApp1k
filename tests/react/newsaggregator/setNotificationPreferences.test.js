import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './setNotificationPreferences';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Sets notification preferences successfully.', async () => {
  fetchMock.post('/api/setNotificationPreferences', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('preferences'), { target: { value: 'Email' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Preferences')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Preferences Saved')).toBeInTheDocument();
}, 10000);

test('Fails to set notification preferences.', async () => {
  fetchMock.post('/api/setNotificationPreferences', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('preferences'), { target: { value: 'Email' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Preferences')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to save preferences')).toBeInTheDocument();
}, 10000);


import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './notificationAppUpdate_profileViewingRestrictions';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should update notification settings', async () => {
  fetchMock.post('/api/notification/settings', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('settings-input'), {target: {value: 'new-settings'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-settings-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('should handle error when updating notification settings fails', async () => {
  fetchMock.post('/api/notification/settings', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('settings-input'), {target: {value: 'new-settings'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-settings-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Viewing restricted profile succeeds with proper data', async () => {
  const profileData = { name: 'John Doe', bio: 'Software Developer' };
  fetchMock.get('/api/profile/valid-id', { body: profileData, status: 200 });

  await act(async () => { render(<MemoryRouter><App profileId={'valid-id'} /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('Software Developer')).toBeInTheDocument();
}, 10000);

test('Viewing restricted profile fails with proper message', async () => {
  fetchMock.get('/api/profile/restricted-id', { body: { error: 'Profile is private' }, status: 403 });

  await act(async () => { render(<MemoryRouter><App profileId={'restricted-id'} /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile is private')).toBeInTheDocument();
}, 10000);
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './profileCreation_profileEditing_feedNotificationSettings_postVisibility';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Profile creation succeeds with valid inputs (from profileCreation_profileEditing)', async () => {
  fetchMock.post('/api/profile', { body: { message: 'Profile created' }, status: 201 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-name'), { target: { value: 'John Doe' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Profile')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile created')).toBeInTheDocument();
}, 10000);

test('Profile creation fails with invalid inputs (from profileCreation_profileEditing)', async () => {
  fetchMock.post('/api/profile', { body: { error: 'Invalid profile inputs' }, status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-name'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Profile')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid profile inputs')).toBeInTheDocument();
}, 10000);

test('Profile editing succeeds with valid changes (from profileCreation_profileEditing)', async () => {
  fetchMock.put('/api/profile', { body: { message: 'Profile updated' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-name'), { target: { value: 'John Updated' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Changes')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile updated')).toBeInTheDocument();
}, 10000);

test('Profile editing fails with invalid changes (from profileCreation_profileEditing)', async () => {
  fetchMock.put('/api/profile', { body: { error: 'Invalid changes' }, status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-name'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Changes')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid changes')).toBeInTheDocument();
}, 10000);

test('Successfully updates feed notification settings. (from feedNotificationSettings_postVisibility)', async () => {
  fetchMock.post('/api/notification-settings', {
    status: 200, body: { message: 'Settings updated' }
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
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

test('Shows error message when updating feed notification settings fails. (from feedNotificationSettings_postVisibility)', async () => {
  fetchMock.post('/api/notification-settings', {
    status: 500, body: { message: 'Failed to update settings' }
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
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

test('Test visibility settings for public posts. (from feedNotificationSettings_postVisibility)', async () => {
  fetchMock.patch('/api/posts/1', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Set Public'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post is now public.')).toBeInTheDocument();
}, 10000);

test('Test visibility settings for private posts. (from feedNotificationSettings_postVisibility)', async () => {
  fetchMock.patch('/api/posts/1', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Set Private'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update visibility settings.')).toBeInTheDocument();
}, 10000);


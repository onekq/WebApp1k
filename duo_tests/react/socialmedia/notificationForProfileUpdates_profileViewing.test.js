import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './notificationForAppUpdates_profileViewing';
import AppView from './notificationForAppUpdates_profileViewing';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should send a notification when a profile is updated', async () => {
  fetchMock.post('/api/profile/update', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-input'), {target: {value: 'new info'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-profile-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a profile update', async () => {
  fetchMock.post('/api/profile/update', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-input'), {target: {value: 'new info'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-profile-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Profile viewing succeeds for existing profile', async () => {
  fetchMock.get('/api/profile/1', { body: { name: 'John Doe' }, status: 200 });

  await act(async () => { render(<MemoryRouter><AppView profileId={1} /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
}, 10000);

test('Profile viewing fails for non-existent profile', async () => {
  fetchMock.get('/api/profile/999', { body: { error: 'Profile not found' }, status: 404 });

  await act(async () => { render(<MemoryRouter><AppView profileId={999} /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile not found')).toBeInTheDocument();
}, 10000);
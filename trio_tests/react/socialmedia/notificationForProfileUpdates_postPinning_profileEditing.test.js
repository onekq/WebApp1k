import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './notificationForProfileUpdates_postPinning_profileEditing';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should send a notification when a profile is updated', async () => {
  fetchMock.post('/api/profile/update', { success: true });

  await act(async () => { render(<MemoryRouter><Profile /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-input'), {target: {value: 'new info'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-profile-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a profile update', async () => {
  fetchMock.post('/api/profile/update', 500);

  await act(async () => { render(<MemoryRouter><Profile /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-input'), {target: {value: 'new info'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-profile-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Test pinning a post to the top of the profile.', async () => {
  fetchMock.put('/api/posts/pin/1', 200);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Pin Post'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post pinned successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure error handling for pinning invalid posts.', async () => {
  fetchMock.put('/api/posts/pin/1', 400);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Pin Post'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to pin post.')).toBeInTheDocument();
}, 10000);

test('Profile editing succeeds with valid changes', async () => {
  fetchMock.put('/api/profile', { body: { message: 'Profile updated' }, status: 200 });

  await act(async () => { render(<MemoryRouter><ProfileEditingForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-name'), { target: { value: 'John Updated' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Changes')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile updated')).toBeInTheDocument();
}, 10000);

test('Profile editing fails with invalid changes', async () => {
  fetchMock.put('/api/profile', { body: { error: 'Invalid changes' }, status: 400 });

  await act(async () => { render(<MemoryRouter><ProfileEditingForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-name'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Changes')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid changes')).toBeInTheDocument();
}, 10000);

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './likingPosts_notificationForNewFollowers_profilePictureUpdate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Should like a valid post', async () => {
  fetchMock.post('api/like', { status: 200 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('like-button-post1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when liking an invalid post', async () => {
  fetchMock.post('api/like', { status: 404 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('like-button-invalid')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('should send a notification when a user gains a new follower', async () => {
  fetchMock.post('/api/follow', { success: true });

  await act(async () => { render(<MemoryRouter><UserProfile /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('follow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a new follower', async () => {
  fetchMock.post('/api/follow', 500);

  await act(async () => { render(<MemoryRouter><UserProfile /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('follow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Profile picture update succeeds with valid image', async () => {
  fetchMock.put('/api/profile/picture', { body: { message: 'Profile picture updated' }, status: 200 });

  await act(async () => { render(<MemoryRouter><ProfilePictureUpdate /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-picture'), { target: { files: [new File([], 'picture.jpg', { type: 'image/jpeg' })] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Picture')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile picture updated')).toBeInTheDocument();
}, 10000);

test('Profile picture update fails with invalid image', async () => {
  fetchMock.put('/api/profile/picture', { body: { error: 'Invalid image format' }, status: 400 });

  await act(async () => { render(<MemoryRouter><ProfilePictureUpdate /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-picture'), { target: { files: [new File([], 'picture.txt', { type: 'text/plain' })] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Picture')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid image format')).toBeInTheDocument();
}, 10000);

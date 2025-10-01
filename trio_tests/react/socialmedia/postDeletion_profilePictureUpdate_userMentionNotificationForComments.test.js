import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './postDeletion_profilePictureUpdate_userMentionNotificationForComments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Verify successful deletion of a post.', async () => {
  fetchMock.delete('/api/posts/1', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Delete'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post deleted successfully!')).toBeInTheDocument();
}, 10000);

test('Check error handling for non-existent post deletion.', async () => {
  fetchMock.delete('/api/posts/1', 404);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Delete'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post not found.')).toBeInTheDocument();
}, 10000);

test('Profile picture update succeeds with valid image', async () => {
  fetchMock.put('/api/profile/picture', { body: { message: 'Profile picture updated' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-picture'), { target: { files: [new File([], 'picture.jpg', { type: 'image/jpeg' })] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Picture')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile picture updated')).toBeInTheDocument();
}, 10000);

test('Profile picture update fails with invalid image', async () => {
  fetchMock.put('/api/profile/picture', { body: { error: 'Invalid image format' }, status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-picture'), { target: { files: [new File([], 'picture.txt', { type: 'text/plain' })] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Picture')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid image format')).toBeInTheDocument();
}, 10000);

test('should send a notification when a user is mentioned in a comment', async () => {
  fetchMock.post('/api/comment/mention', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), {target: {value: '@jane'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a user mention in a comment', async () => {
  fetchMock.post('/api/comment/mention', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), {target: {value: '@jane'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

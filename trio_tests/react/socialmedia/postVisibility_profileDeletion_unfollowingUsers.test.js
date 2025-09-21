import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './postVisibility_profileDeletion_unfollowingUsers';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Test visibility settings for public posts.', async () => {
  fetchMock.patch('/api/posts/1', 200);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Set Public'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post is now public.')).toBeInTheDocument();
}, 10000);

test('Test visibility settings for private posts.', async () => {
  fetchMock.patch('/api/posts/1', 400);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Set Private'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update visibility settings.')).toBeInTheDocument();
}, 10000);

test('Profile deletion succeeds for valid profile', async () => {
  fetchMock.delete('/api/profile/1', { body: { message: 'Profile deleted' }, status: 200 });

  await act(async () => { render(<MemoryRouter><ProfileDeletion profileId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Profile')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile deleted')).toBeInTheDocument();
}, 10000);

test('Profile deletion fails for non-existent profile', async () => {
  fetchMock.delete('/api/profile/9999', { body: { error: 'Profile not found' }, status: 404 });

  await act(async () => { render(<MemoryRouter><ProfileDeletion profileId={9999} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Profile')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile not found')).toBeInTheDocument();
}, 10000);

test('Should unfollow a followed user', async () => {
  fetchMock.post('api/unfollow', { status: 200 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-input'), { target: { value: 'followedUser' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Unfollow')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when trying to unfollow a user not followed', async () => {
  fetchMock.post('api/unfollow', { status: 404 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-input'), { target: { value: 'unfollowedUser' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Unfollow')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

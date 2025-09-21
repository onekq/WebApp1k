import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './feedManagement_postVisibility_privacySettingsUpdate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Displays posts from followed users in feed successfully.', async () => {
  fetchMock.get('/api/feed', {
    status: 200, body: [{ id: 1, content: 'Post from followed user' }]
  });

  await act(async () => {
    render(<MemoryRouter><FeedComponent /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post from followed user')).toBeInTheDocument();
}, 10000);

test('Displays error when failing to load posts from followed users in feed.', async () => {
  fetchMock.get('/api/feed', {
    status: 500, body: { message: 'Failed to load feed' }
  });

  await act(async () => {
    render(<MemoryRouter><FeedComponent /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load feed')).toBeInTheDocument();
}, 10000);

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

test('Privacy settings update succeeds', async () => {
  fetchMock.put('/api/profile/privacy-settings', { body: { message: 'Privacy settings updated' }, status: 200 });

  await act(async () => { render(<MemoryRouter><PrivacySettingsUpdate /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('privacy-setting'), { target: { value: 'private' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Settings')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Privacy settings updated')).toBeInTheDocument();
}, 10000);

test('Privacy settings update fails', async () => {
  fetchMock.put('/api/profile/privacy-settings', { body: { error: 'Failed to update settings' }, status: 400 });

  await act(async () => { render(<MemoryRouter><PrivacySettingsUpdate /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('privacy-setting'), { target: { value: 'invalid' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Settings')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to update settings')).toBeInTheDocument();
}, 10000);

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './commentingOnPosts_notificationForPostPins_privacySettingsUpdate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Should add a comment to a post', async () => {
  fetchMock.post('api/comment', { status: 200 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Great post!' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Comment')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when adding an invalid comment to a post', async () => {
  fetchMock.post('api/comment', { status: 400 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Comment')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('should send a notification when a post is pinned', async () => {
  fetchMock.post('/api/pin', { success: true });

  await act(async () => { render(<MemoryRouter><Post /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pin-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a post pin', async () => {
  fetchMock.post('/api/pin', 500);

  await act(async () => { render(<MemoryRouter><Post /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pin-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
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

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './postDraftEditing_profileDeletion_taggingUsersInComments_userBlocking';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Test editing saved drafts. (from postDraftEditing_profileDeletion)', async () => {
  fetchMock.put('/api/posts/draft/1', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByText('Edit Draft'), { target: { value: 'Updated draft content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft updated successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure changes are saved and displayed (draft). (from postDraftEditing_profileDeletion)', async () => {
  fetchMock.put('/api/posts/draft/1', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByText('Edit Draft'), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update draft.')).toBeInTheDocument();
}, 10000);

test('Profile deletion succeeds for valid profile (from postDraftEditing_profileDeletion)', async () => {
  fetchMock.delete('/api/profile/1', { body: { message: 'Profile deleted' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App profileId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Profile')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile deleted')).toBeInTheDocument();
}, 10000);

test('Profile deletion fails for non-existent profile (from postDraftEditing_profileDeletion)', async () => {
  fetchMock.delete('/api/profile/9999', { body: { error: 'Profile not found' }, status: 404 });

  await act(async () => { render(<MemoryRouter><App profileId={9999} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Profile')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile not found')).toBeInTheDocument();
}, 10000);

test('Should tag a valid user in a comment (from taggingUsersInComments_userBlocking)', async () => {
  fetchMock.post('api/tag', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input-comment'), { target: { value: 'userToTag' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Tag')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when tagging an invalid user in a comment (from taggingUsersInComments_userBlocking)', async () => {
  fetchMock.post('api/tag', { status: 404 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input-comment'), { target: { value: 'invalidUser' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Tag')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('User blocking succeeds for valid user (from taggingUsersInComments_userBlocking)', async () => {
  fetchMock.post('/api/profile/block', { body: { message: 'User blocked' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App userId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Block User')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('User blocked')).toBeInTheDocument();
}, 10000);

test('User blocking fails for invalid user (from taggingUsersInComments_userBlocking)', async () => {
  fetchMock.post('/api/profile/block', { body: { error: 'Invalid user' }, status: 400 });

  await act(async () => { render(<MemoryRouter><App userId={9999} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Block User')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid user')).toBeInTheDocument();
}, 10000);


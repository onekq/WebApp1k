import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './postDraftDeletion_taggingUsersInPosts_followingUsers_profileCreation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Verify deletion of saved drafts. (from postDraftDeletion_taggingUsersInPosts)', async () => {
  fetchMock.delete('/api/posts/draft/1', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Delete Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft deleted successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure error handling for non-existent draft deletion. (from postDraftDeletion_taggingUsersInPosts)', async () => {
  fetchMock.delete('/api/posts/draft/1', 404);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Delete Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft not found.')).toBeInTheDocument();
}, 10000);

test('Should tag a valid user in a post (from postDraftDeletion_taggingUsersInPosts)', async () => {
  fetchMock.post('api/tag', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input-post'), { target: { value: 'userToTag' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Tag')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when tagging an invalid user in a post (from postDraftDeletion_taggingUsersInPosts)', async () => {
  fetchMock.post('api/tag', { status: 404 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input-post'), { target: { value: 'invalidUser' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Tag')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Should follow a valid user (from followingUsers_profileCreation)', async () => {
  fetchMock.post('api/follow', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-input'), { target: { value: 'validUser' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Follow')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when trying to follow an invalid user (from followingUsers_profileCreation)', async () => {
  fetchMock.post('api/follow', { status: 404 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-input'), { target: { value: 'invalidUser' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Follow')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Profile creation succeeds with valid inputs (from followingUsers_profileCreation)', async () => {
  fetchMock.post('/api/profile', { body: { message: 'Profile created' }, status: 201 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-name'), { target: { value: 'John Doe' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Profile')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile created')).toBeInTheDocument();
}, 10000);

test('Profile creation fails with invalid inputs (from followingUsers_profileCreation)', async () => {
  fetchMock.post('/api/profile', { body: { error: 'Invalid profile inputs' }, status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-name'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Profile')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid profile inputs')).toBeInTheDocument();
}, 10000);


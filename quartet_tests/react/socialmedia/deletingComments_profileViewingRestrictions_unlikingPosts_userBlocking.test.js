import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deletingComments_profileViewingRestrictions_unlikingPosts_userBlocking';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should delete an existing comment (from deletingComments_profileViewingRestrictions)', async () => {
  fetchMock.delete('api/comment', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when deleting a non-existent comment (from deletingComments_profileViewingRestrictions)', async () => {
  fetchMock.delete('api/comment', { status: 404 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-comment-button-invalid')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Viewing restricted profile succeeds with proper data (from deletingComments_profileViewingRestrictions)', async () => {
  const profileData = { name: 'John Doe', bio: 'Software Developer' };
  fetchMock.get('/api/profile/valid-id', { body: profileData, status: 200 });

  await act(async () => { render(<MemoryRouter><App profileId={'valid-id'} /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('Software Developer')).toBeInTheDocument();
}, 10000);

test('Viewing restricted profile fails with proper message (from deletingComments_profileViewingRestrictions)', async () => {
  fetchMock.get('/api/profile/restricted-id', { body: { error: 'Profile is private' }, status: 403 });

  await act(async () => { render(<MemoryRouter><App profileId={'restricted-id'} /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile is private')).toBeInTheDocument();
}, 10000);

test('Should unlike a liked post (from unlikingPosts_userBlocking)', async () => {
  fetchMock.post('api/unlike', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unlike-button-post1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when unliking a post not liked (from unlikingPosts_userBlocking)', async () => {
  fetchMock.post('api/unlike', { status: 404 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unlike-button-invalid')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('User blocking succeeds for valid user (from unlikingPosts_userBlocking)', async () => {
  fetchMock.post('/api/profile/block', { body: { message: 'User blocked' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App userId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Block User')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('User blocked')).toBeInTheDocument();
}, 10000);

test('User blocking fails for invalid user (from unlikingPosts_userBlocking)', async () => {
  fetchMock.post('/api/profile/block', { body: { error: 'Invalid user' }, status: 400 });

  await act(async () => { render(<MemoryRouter><App userId={9999} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Block User')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid user')).toBeInTheDocument();
}, 10000);


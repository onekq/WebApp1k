import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deletingComments_profileCreation_taggingUsersInPosts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Should delete an existing comment', async () => {
  fetchMock.delete('api/comment', { status: 200 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when deleting a non-existent comment', async () => {
  fetchMock.delete('api/comment', { status: 404 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-comment-button-invalid')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Profile creation succeeds with valid inputs', async () => {
  fetchMock.post('/api/profile', { body: { message: 'Profile created' }, status: 201 });

  await act(async () => { render(<MemoryRouter><ProfileCreationForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-name'), { target: { value: 'John Doe' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Profile')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile created')).toBeInTheDocument();
}, 10000);

test('Profile creation fails with invalid inputs', async () => {
  fetchMock.post('/api/profile', { body: { error: 'Invalid profile inputs' }, status: 400 });

  await act(async () => { render(<MemoryRouter><ProfileCreationForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-name'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Profile')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid profile inputs')).toBeInTheDocument();
}, 10000);

test('Should tag a valid user in a post', async () => {
  fetchMock.post('api/tag', { status: 200 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input-post'), { target: { value: 'userToTag' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Tag')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when tagging an invalid user in a post', async () => {
  fetchMock.post('api/tag', { status: 404 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input-post'), { target: { value: 'invalidUser' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Tag')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

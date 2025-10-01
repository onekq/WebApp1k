import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './commentReplies_postCreation_taggingUsersInComments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Should reply to an existing comment', async () => {
  fetchMock.post('api/reply', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('reply-input'), { target: { value: 'Nice comment!' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Reply')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when replying to an invalid comment', async () => {
  fetchMock.post('api/reply', { status: 404 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('reply-input'), { target: { value: 'Nice comment!' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Reply')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Verify post creation with valid content.', async () => {
  fetchMock.post('/api/posts', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Write a post...'), { target: { value: 'Hello World!' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Post'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post created successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure error handling for invalid post content.', async () => {
  fetchMock.post('/api/posts', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Write a post...'), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Post'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post content cannot be empty.')).toBeInTheDocument();
}, 10000);

test('Should tag a valid user in a comment', async () => {
  fetchMock.post('api/tag', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input-comment'), { target: { value: 'userToTag' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Tag')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when tagging an invalid user in a comment', async () => {
  fetchMock.post('api/tag', { status: 404 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input-comment'), { target: { value: 'invalidUser' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Tag')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

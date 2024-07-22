import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './createBlogPost';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: create a new blog post', async () => {
  fetchMock.post('/api/createPost', { status: 200, body: { id: 1, title: 'New Post', content: 'Some content' } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Post' } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'Some content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/create/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('New Post')).toBeInTheDocument();
}, 10000);

test('Failure: create a new blog post with an empty title', async () => {
  fetchMock.post('/api/createPost', { status: 400, body: { error: 'Title cannot be empty' } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'Some content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/create/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Title cannot be empty')).toBeInTheDocument();
}, 10000);


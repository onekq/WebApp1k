import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './publishBlogPost_retrievePostsByTag';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: publish a draft blog post', async () => {
  fetchMock.put('/api/publishPost', { status: 200, body: { id: 1, title: 'Draft Post', content: 'Some content', status: 'Published' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/publish/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post published successfully')).toBeInTheDocument();
}, 10000);

test('Failure: publish a draft post without content', async () => {
  fetchMock.put('/api/publishPost', { status: 400, body: { error: 'Content cannot be empty' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/publish/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Content cannot be empty')).toBeInTheDocument();
}, 10000);

test('User can retrieve posts by tag successfully', async () => {
  fetchMock.get('/tags/1/posts', {
    status: 200,
    body: [{ id: 1, title: 'First Post' }, { id: 2, title: 'Second Post' }]
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tag Select'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Posts')); });

  expect(fetchMock.calls('/tags/1/posts').length).toBe(1);
  expect(screen.getByText('First Post')).toBeInTheDocument();
  expect(screen.getByText('Second Post')).toBeInTheDocument();
}, 10000);

test('User gets an error message when retrieving posts by tag fails', async () => {
  fetchMock.get('/tags/1/posts', {
    status: 500,
    body: { error: 'Unable to fetch posts' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tag Select'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Posts')); });

  expect(fetchMock.calls('/tags/1/posts').length).toBe(1);
  expect(screen.getByText('Error: Unable to fetch posts')).toBeInTheDocument();
}, 10000);
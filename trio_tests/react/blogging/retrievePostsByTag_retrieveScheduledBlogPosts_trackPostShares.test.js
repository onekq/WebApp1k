import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './retrievePostsByTag_retrieveScheduledBlogPosts_trackPostShares';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('User can retrieve posts by tag successfully', async () => {
  fetchMock.get('/tags/1/posts', {
    status: 200,
    body: [{ id: 1, title: 'First Post' }, { id: 2, title: 'Second Post' }]
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
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

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tag Select'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Posts')); });

  expect(fetchMock.calls('/tags/1/posts').length).toBe(1);
  expect(screen.getByText('Error: Unable to fetch posts')).toBeInTheDocument();
}, 10000);

test('Success: retrieve a list of scheduled blog posts', async () => {
  fetchMock.get('/api/posts?status=scheduled', { status: 200, body: [{ id: 1, title: 'Scheduled Post' }] });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Scheduled Post')).toBeInTheDocument();
}, 10000);

test('Failure: fetch scheduled posts but none exist', async () => {
  fetchMock.get('/api/posts?status=scheduled', { status: 404, body: { error: 'No scheduled posts found' } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No scheduled posts found')).toBeInTheDocument();
}, 10000);

test('successfully tracks post shares on social media', async () => {
  fetchMock.post('/api/trackPostShares', { status: 200 });

  await act(async () => { render(<MemoryRouter><TrackPostShares postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share Post')); });

  expect(fetchMock.calls('/api/trackPostShares')).toHaveLength(1);
  expect(fetchMock.calls('/api/trackPostShares')[0][1].body).toContain('"postId":"1"');
  expect(screen.getByText('Shares: 1')).toBeInTheDocument();
}, 10000);

test('fails to track post shares with an error message', async () => {
  fetchMock.post('/api/trackPostShares', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><TrackPostShares postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share Post')); });

  expect(fetchMock.calls('/api/trackPostShares')).toHaveLength(1);
  expect(screen.getByText('Error tracking shares')).toBeInTheDocument();
}, 10000);

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './checkForBrokenLinks_publishBlogPost_replyToComment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully checks for broken links in a blog post', async () => {
  fetchMock.post('/api/check-broken-links', { status: 200 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/check for broken links/i)); });

  expect(fetchMock.calls('/api/check-broken-links').length).toBe(1);
  expect(screen.getByText(/broken links checked successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to check for broken links in a blog post due to server error', async () => {
  fetchMock.post('/api/check-broken-links', { status: 500 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/check for broken links/i)); });

  expect(fetchMock.calls('/api/check-broken-links').length).toBe(1);
  expect(screen.getByText(/failed to check for broken links/i)).toBeInTheDocument();
}, 10000);

test('Success: publish a draft blog post', async () => {
  fetchMock.put('/api/publishPost', { status: 200, body: { id: 1, title: 'Draft Post', content: 'Some content', status: 'Published' } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
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
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/publish/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Content cannot be empty')).toBeInTheDocument();
}, 10000);

test('successfully replies to a comment', async () => {
  fetchMock.post('/api/comments/reply', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText(/Reply to a comment/i), { target: { value: 'Thanks for your comment!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Reply/i)); });

  expect(fetchMock.calls('/api/comments/reply').length).toBe(1);
  expect(screen.getByText(/Reply added successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to reply to a comment', async () => {
  fetchMock.post('/api/comments/reply', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText(/Reply to a comment/i), { target: { value: 'Thanks for your comment!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Reply/i)); });

  expect(fetchMock.calls('/api/comments/reply').length).toBe(1);
  expect(screen.getByText(/Failed to add reply/i)).toBeInTheDocument();
}, 10000);

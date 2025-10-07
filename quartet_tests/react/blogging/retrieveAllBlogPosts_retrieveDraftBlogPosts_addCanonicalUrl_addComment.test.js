import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './retrieveAllBlogPosts_retrieveDraftBlogPosts_addCanonicalUrl_addComment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: retrieve a list of all blog posts (from retrieveAllBlogPosts_retrieveDraftBlogPosts)', async () => {
  fetchMock.get('/api/posts', { status: 200, body: [{ id: 1, title: 'First Post' }, { id: 2, title: 'Second Post' }] });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('First Post')).toBeInTheDocument();
  expect(screen.getByText('Second Post')).toBeInTheDocument();
}, 10000);

test('Failure: retrieve a list of blog posts with server error (from retrieveAllBlogPosts_retrieveDraftBlogPosts)', async () => {
  fetchMock.get('/api/posts', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Internal Server Error')).toBeInTheDocument();
}, 10000);

test('Success: retrieve a list of draft blog posts (from retrieveAllBlogPosts_retrieveDraftBlogPosts)', async () => {
  fetchMock.get('/api/posts?status=draft', { status: 200, body: [{ id: 1, title: 'Draft Post' }] });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft Post')).toBeInTheDocument();
}, 10000);

test('Failure: fetch draft posts but none exist (from retrieveAllBlogPosts_retrieveDraftBlogPosts)', async () => {
  fetchMock.get('/api/posts?status=draft', { status: 404, body: { error: 'No draft posts found' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No draft posts found')).toBeInTheDocument();
}, 10000);

test('successfully adds a canonical URL to a post (from addCanonicalUrl_addComment)', async () => {
  fetchMock.post('/api/canonical-url', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/canonical url/i), { target: { value: 'http://example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/canonical-url').length).toBe(1);
  expect(screen.getByText(/canonical url updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add a canonical URL to a post due to server error (from addCanonicalUrl_addComment)', async () => {
  fetchMock.post('/api/canonical-url', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/canonical url/i), { target: { value: 'http://example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/canonical-url').length).toBe(1);
  expect(screen.getByText(/failed to update canonical url/i)).toBeInTheDocument();
}, 10000);

test('successfully adds a comment to a post (from addCanonicalUrl_addComment)', async () => {
  fetchMock.post('/api/comments', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText(/Add a comment/i), { target: { value: 'Great post!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Submit/i)); });

  expect(fetchMock.calls('/api/comments').length).toBe(1);
  expect(screen.getByText(/Comment added successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add a comment to a post (from addCanonicalUrl_addComment)', async () => {
  fetchMock.post('/api/comments', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText(/Add a comment/i), { target: { value: 'Great post!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Submit/i)); });

  expect(fetchMock.calls('/api/comments').length).toBe(1);
  expect(screen.getByText(/Failed to add comment/i)).toBeInTheDocument();
}, 10000);


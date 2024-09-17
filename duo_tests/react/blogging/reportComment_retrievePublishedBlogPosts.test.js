import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './reportComment_retrievePublishedBlogPosts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully reports a comment', async () => {
  fetchMock.post('/api/comments/report/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Report/i)); });

  expect(fetchMock.calls('/api/comments/report/1').length).toBe(1);
  expect(screen.getByText(/Comment reported successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to report a comment', async () => {
  fetchMock.post('/api/comments/report/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Report/i)); });

  expect(fetchMock.calls('/api/comments/report/1').length).toBe(1);
  expect(screen.getByText(/Failed to report comment/i)).toBeInTheDocument();
}, 10000);

test('Success: retrieve a list of published blog posts', async () => {
  fetchMock.get('/api/posts?status=published', { status: 200, body: [{ id: 1, title: 'Published Post' }] });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Published Post')).toBeInTheDocument();
}, 10000);

test('Failure: fetch published posts but none exist', async () => {
  fetchMock.get('/api/posts?status=published', { status: 404, body: { error: 'No published posts found' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No published posts found')).toBeInTheDocument();
}, 10000);
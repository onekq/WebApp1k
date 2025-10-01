import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './analyzeReaderEngagement_retrieveAllBlogPosts_retrieveCommentCount';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully analyzes reader engagement', async () => {
  fetchMock.get('/api/analyzeReaderEngagement?postId=1', { status: 200, body: { engagementScore: 85 } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Analyze Engagement')); });

  expect(fetchMock.calls('/api/analyzeReaderEngagement')).toHaveLength(1);
  expect(screen.getByText('Engagement Score: 85')).toBeInTheDocument();
}, 10000);

test('fails to analyze reader engagement with an error message', async () => {
  fetchMock.get('/api/analyzeReaderEngagement?postId=1', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Analyze Engagement')); });

  expect(fetchMock.calls('/api/analyzeReaderEngagement')).toHaveLength(1);
  expect(screen.getByText('Error analyzing engagement')).toBeInTheDocument();
}, 10000);

test('Success: retrieve a list of all blog posts', async () => {
  fetchMock.get('/api/posts', { status: 200, body: [{ id: 1, title: 'First Post' }, { id: 2, title: 'Second Post' }] });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('First Post')).toBeInTheDocument();
  expect(screen.getByText('Second Post')).toBeInTheDocument();
}, 10000);

test('Failure: retrieve a list of blog posts with server error', async () => {
  fetchMock.get('/api/posts', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Internal Server Error')).toBeInTheDocument();
}, 10000);

test('successfully retrieves comment count for a post', async () => {
  fetchMock.get('/api/comments/count?postId=1', { count: 10 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/comments/count?postId=1').length).toBe(1);
  expect(screen.getByText(/10 comments/i)).toBeInTheDocument();
}, 10000);

test('fails to retrieve comment count for a post', async () => {
  fetchMock.get('/api/comments/count?postId=1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/comments/count?postId=1').length).toBe(1);
  expect(screen.getByText(/Failed to retrieve comment count/i)).toBeInTheDocument();
}, 10000);

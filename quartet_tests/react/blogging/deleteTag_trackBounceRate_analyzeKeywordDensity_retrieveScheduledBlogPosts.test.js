import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteTag_trackBounceRate_analyzeKeywordDensity_retrieveScheduledBlogPosts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can delete a tag successfully (from deleteTag_trackBounceRate)', async () => {
  fetchMock.delete('/tags/1', {
    status: 204
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Tag')); });

  expect(fetchMock.calls('/tags/1').length).toBe(1);
  expect(screen.getByText('Tag deleted successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when deleting a tag fails (from deleteTag_trackBounceRate)', async () => {
  fetchMock.delete('/tags/1', {
    status: 500,
    body: { error: 'Unable to delete tag' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Tag')); });

  expect(fetchMock.calls('/tags/1').length).toBe(1);
  expect(screen.getByText('Error: Unable to delete tag')).toBeInTheDocument();
}, 10000);

test('successfully tracks bounce rate (from deleteTag_trackBounceRate)', async () => {
  fetchMock.post('/api/trackBounceRate', { status: 200 });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Track Bounce Rate')); });

  expect(fetchMock.calls('/api/trackBounceRate')).toHaveLength(1);
  expect(screen.getByText('Bounce Rate: 50%')).toBeInTheDocument();
}, 10000);

test('fails to track bounce rate with an error message (from deleteTag_trackBounceRate)', async () => {
  fetchMock.post('/api/trackBounceRate', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Track Bounce Rate')); });

  expect(fetchMock.calls('/api/trackBounceRate')).toHaveLength(1);
  expect(screen.getByText('Error tracking bounce rate')).toBeInTheDocument();
}, 10000);

test('successfully analyzes keyword density of a post (from analyzeKeywordDensity_retrieveScheduledBlogPosts)', async () => {
  fetchMock.post('/api/keyword-density', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/analyze keyword density/i)); });

  expect(fetchMock.calls('/api/keyword-density').length).toBe(1);
  expect(screen.getByText(/keyword density analyzed successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to analyze keyword density of a post due to server error (from analyzeKeywordDensity_retrieveScheduledBlogPosts)', async () => {
  fetchMock.post('/api/keyword-density', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/analyze keyword density/i)); });

  expect(fetchMock.calls('/api/keyword-density').length).toBe(1);
  expect(screen.getByText(/failed to analyze keyword density/i)).toBeInTheDocument();
}, 10000);

test('Success: retrieve a list of scheduled blog posts (from analyzeKeywordDensity_retrieveScheduledBlogPosts)', async () => {
  fetchMock.get('/api/posts?status=scheduled', { status: 200, body: [{ id: 1, title: 'Scheduled Post' }] });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Scheduled Post')).toBeInTheDocument();
}, 10000);

test('Failure: fetch scheduled posts but none exist (from analyzeKeywordDensity_retrieveScheduledBlogPosts)', async () => {
  fetchMock.get('/api/posts?status=scheduled', { status: 404, body: { error: 'No scheduled posts found' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No scheduled posts found')).toBeInTheDocument();
}, 10000);


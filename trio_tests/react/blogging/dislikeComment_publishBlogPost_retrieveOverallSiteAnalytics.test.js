import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './dislikeComment_publishBlogPost_retrieveOverallSiteAnalytics';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully dislikes a comment', async () => {
  fetchMock.post('/api/comments/dislike/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Dislike/i)); });

  expect(fetchMock.calls('/api/comments/dislike/1').length).toBe(1);
  expect(screen.getByText(/Comment disliked successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to dislike a comment', async () => {
  fetchMock.post('/api/comments/dislike/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Dislike/i)); });

  expect(fetchMock.calls('/api/comments/dislike/1').length).toBe(1);
  expect(screen.getByText(/Failed to dislike comment/i)).toBeInTheDocument();
}, 10000);

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

test('successfully retrieves overall site analytics', async () => {
  fetchMock.get('/api/getSiteAnalytics', { status: 200, body: { totalPosts: 100, totalViews: 1000 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Get Site Analytics')); });

  expect(fetchMock.calls('/api/getSiteAnalytics')).toHaveLength(1);
  expect(screen.getByText('Total Posts: 100')).toBeInTheDocument();
  expect(screen.getByText('Total Views: 1000')).toBeInTheDocument();
}, 10000);

test('fails to retrieve overall site analytics with an error message', async () => {
  fetchMock.get('/api/getSiteAnalytics', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Get Site Analytics')); });

  expect(fetchMock.calls('/api/getSiteAnalytics')).toHaveLength(1);
  expect(screen.getByText('Error retrieving site analytics')).toBeInTheDocument();
}, 10000);

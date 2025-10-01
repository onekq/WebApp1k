import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editBlogPost_replyToComment_retrieveOverallSiteAnalytics';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Success: edit an existing blog post', async () => {
  fetchMock.put('/api/editPost', { status: 200, body: { id: 1, title: 'Updated Post', content: 'Updated content' } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Updated Post' } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'Updated content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/update/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post updated successfully')).toBeInTheDocument();
}, 10000);

test('Failure: edit an existing blog post without authorization', async () => {
  fetchMock.put('/api/editPost', { status: 403, body: { error: 'Unauthorized' } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Updated Post' } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'Updated content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/update/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Unauthorized')).toBeInTheDocument();
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

test('successfully retrieves overall site analytics', async () => {
  fetchMock.get('/api/getSiteAnalytics', { status: 200, body: { totalPosts: 100, totalViews: 1000 } });

  await act(async () => { render(<MemoryRouter><RetrieveSiteAnalytics /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Get Site Analytics')); });

  expect(fetchMock.calls('/api/getSiteAnalytics')).toHaveLength(1);
  expect(screen.getByText('Total Posts: 100')).toBeInTheDocument();
  expect(screen.getByText('Total Views: 1000')).toBeInTheDocument();
}, 10000);

test('fails to retrieve overall site analytics with an error message', async () => {
  fetchMock.get('/api/getSiteAnalytics', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><RetrieveSiteAnalytics /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Get Site Analytics')); });

  expect(fetchMock.calls('/api/getSiteAnalytics')).toHaveLength(1);
  expect(screen.getByText('Error retrieving site analytics')).toBeInTheDocument();
}, 10000);

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addStructuredData_retrieveComments_retrieveScheduledBlogPosts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully adds structured data to a post', async () => {
  fetchMock.post('/api/structured-data', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/structured data/i), { target: { value: '{ "type": "BlogPosting" }' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/structured-data').length).toBe(1);
  expect(screen.getByText(/structured data added successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add structured data to a post due to server error', async () => {
  fetchMock.post('/api/structured-data', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/structured data/i), { target: { value: '{ "type": "BlogPosting" }' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/structured-data').length).toBe(1);
  expect(screen.getByText(/failed to add structured data/i)).toBeInTheDocument();
}, 10000);

test('successfully retrieves comments for a post', async () => {
  fetchMock.get('/api/comments?postId=1', [{ id: 1, content: 'Great post!' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/comments?postId=1').length).toBe(1);
  expect(screen.getByText(/Great post!/i)).toBeInTheDocument();
}, 10000);

test('fails to retrieve comments for a post', async () => {
  fetchMock.get('/api/comments?postId=1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/comments?postId=1').length).toBe(1);
  expect(screen.getByText(/Failed to retrieve comments/i)).toBeInTheDocument();
}, 10000);

test('Success: retrieve a list of scheduled blog posts', async () => {
  fetchMock.get('/api/posts?status=scheduled', { status: 200, body: [{ id: 1, title: 'Scheduled Post' }] });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Scheduled Post')).toBeInTheDocument();
}, 10000);

test('Failure: fetch scheduled posts but none exist', async () => {
  fetchMock.get('/api/posts?status=scheduled', { status: 404, body: { error: 'No scheduled posts found' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No scheduled posts found')).toBeInTheDocument();
}, 10000);

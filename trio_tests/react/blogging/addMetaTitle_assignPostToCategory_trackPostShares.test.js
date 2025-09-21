import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addMetaTitle_assignPostToCategory_trackPostShares';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully adds a meta title to a post', async () => {
  fetchMock.post('/api/meta-title', { status: 200 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/meta title/i), { target: { value: 'New Meta Title' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/meta-title').length).toBe(1);
  expect(screen.getByText(/meta title updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add a meta title to a post due to server error', async () => {
  fetchMock.post('/api/meta-title', { status: 500 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/meta title/i), { target: { value: 'New Meta Title' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/meta-title').length).toBe(1);
  expect(screen.getByText(/failed to update meta title/i)).toBeInTheDocument();
}, 10000);

test('User can assign a post to a category successfully', async () => {
  fetchMock.post('/posts/1/categories', {
    status: 200,
    body: { postId: 1, categoryId: 1 }
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Category Select'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign Category')); });

  expect(fetchMock.calls('/posts/1/categories').length).toBe(1);
  expect(screen.getByText('Post assigned to category successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when assigning a post to a category fails', async () => {
  fetchMock.post('/posts/1/categories', {
    status: 500,
    body: { error: 'Unable to assign category' }
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Category Select'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign Category')); });

  expect(fetchMock.calls('/posts/1/categories').length).toBe(1);
  expect(screen.getByText('Error: Unable to assign category')).toBeInTheDocument();
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

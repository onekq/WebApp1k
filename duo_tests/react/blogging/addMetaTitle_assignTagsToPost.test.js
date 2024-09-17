import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addMetaTitle_assignTagsToPost';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds a meta title to a post', async () => {
  fetchMock.post('/api/meta-title', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/meta title/i), { target: { value: 'New Meta Title' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/meta-title').length).toBe(1);
  expect(screen.getByText(/meta title updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add a meta title to a post due to server error', async () => {
  fetchMock.post('/api/meta-title', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/meta title/i), { target: { value: 'New Meta Title' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/meta-title').length).toBe(1);
  expect(screen.getByText(/failed to update meta title/i)).toBeInTheDocument();
}, 10000);

test('User can assign tags to a post successfully', async () => {
  fetchMock.post('/posts/1/tags', {
    status: 200,
    body: { postId: 1, tags: [1, 2] }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tags Select'), { target: { value: ['1', '2'] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign Tags')); });

  expect(fetchMock.calls('/posts/1/tags').length).toBe(1);
  expect(screen.getByText('Tags assigned to post successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when assigning tags to a post fails', async () => {
  fetchMock.post('/posts/1/tags', {
    status: 500,
    body: { error: 'Unable to assign tags' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tags Select'), { target: { value: ['1', '2'] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign Tags')); });

  expect(fetchMock.calls('/posts/1/tags').length).toBe(1);
  expect(screen.getByText('Error: Unable to assign tags')).toBeInTheDocument();
}, 10000);
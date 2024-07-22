import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import DiscussionForum from './discussionForumParticipation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully posts a new forum post', async () => {
  fetchMock.post('/forum/posts', { status: 201 });

  await act(async () => { render(<MemoryRouter><DiscussionForum /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('post-content'), { target: { value: 'New post' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Post')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post successful')).toBeInTheDocument();
}, 10000);

test('Fails to post a new forum post', async () => {
  fetchMock.post('/forum/posts', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><DiscussionForum /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('post-content'), { target: { value: 'New post' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Post')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Posting failed')).toBeInTheDocument();
}, 10000);


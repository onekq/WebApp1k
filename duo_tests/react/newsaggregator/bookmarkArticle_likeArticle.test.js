import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './bookmarkArticle_likeArticle';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('bookmarks an article successfully', async () => {
  fetchMock.post('/bookmark', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Bookmark')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Article bookmarked')).toBeInTheDocument();
}, 10000);

test('fails to bookmark an article with error message', async () => {
  fetchMock.post('/bookmark', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Bookmark')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to bookmark')).toBeInTheDocument();
}, 10000);

test('likes an article successfully', async () => {
  fetchMock.post('/like', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Liked')).toBeInTheDocument();
}, 10000);

test('fails to like an article with error message', async () => {
  fetchMock.post('/like', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to like')).toBeInTheDocument();
}, 10000);
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import BookmarkArticleComponent from './bookmarkArticle';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('bookmarks an article successfully', async () => {
  fetchMock.post('/bookmark', 200);

  await act(async () => { render(<MemoryRouter><BookmarkArticleComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Bookmark')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Article bookmarked')).toBeInTheDocument();
}, 10000);

test('fails to bookmark an article with error message', async () => {
  fetchMock.post('/bookmark', 500);

  await act(async () => { render(<MemoryRouter><BookmarkArticleComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Bookmark')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to bookmark')).toBeInTheDocument();
}, 10000);


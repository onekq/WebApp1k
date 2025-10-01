import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './expandArticlePreview_removeBookmark_retrieveBookmarkedArticle';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Allows users to expand article previews to full articles successfully', async () => {
  fetchMock.get('/api/articles/1', { status: 200, body: { id: 1, content: 'Full Test Article Content' } });

  await act(async () => { render(<MemoryRouter><HomePage /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Test Article')); });

  expect(fetchMock.calls()).toHaveLength(2);
  expect(screen.getByText('Full Test Article Content')).toBeInTheDocument();
}, 10000);

test('Fails to expand article previews to full articles', async () => {
  fetchMock.get('/api/articles/1', { status: 500 });

  await act(async () => { render(<MemoryRouter><HomePage /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Test Article')); });

  expect(fetchMock.calls()).toHaveLength(2);
  expect(screen.getByText('Failed to load full article')).toBeInTheDocument();
}, 10000);

test('removes a bookmark from an article successfully', async () => {
  fetchMock.delete('/bookmark/1', 200);

  await act(async () => { render(<MemoryRouter><RemoveBookmarkComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove Bookmark')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Bookmark removed')).toBeInTheDocument();
}, 10000);

test('fails to remove a bookmark from an article with error message', async () => {
  fetchMock.delete('/bookmark/1', 500);

  await act(async () => { render(<MemoryRouter><RemoveBookmarkComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove Bookmark')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to remove bookmark')).toBeInTheDocument();
}, 10000);

test('retrieves bookmarked articles successfully', async () => {
  fetchMock.get('/bookmarks', { articles: [{ id: 1, title: 'Test Article' }] });

  await act(async () => { render(<MemoryRouter><RetrieveBookmarkedArticlesComponent /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Test Article')).toBeInTheDocument();
}, 10000);

test('fails to retrieve bookmarked articles with error message', async () => {
  fetchMock.get('/bookmarks', 500);

  await act(async () => { render(<MemoryRouter><RetrieveBookmarkedArticlesComponent /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load bookmarks')).toBeInTheDocument();
}, 10000);

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './notifyTrendingArticles_retrieveBookmarkedArticle_commentOnArticle_trackArticleLikeCount';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Notifies user about trending articles successfully. (from notifyTrendingArticles_retrieveBookmarkedArticle)', async () => {
  fetchMock.post('/api/notifyTrendingArticles', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Trending Articles')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Trending articles notification sent')).toBeInTheDocument();
}, 10000);

test('Fails to notify user about trending articles. (from notifyTrendingArticles_retrieveBookmarkedArticle)', async () => {
  fetchMock.post('/api/notifyTrendingArticles', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Trending Articles')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to notify')).toBeInTheDocument();
}, 10000);

test('retrieves bookmarked articles successfully (from notifyTrendingArticles_retrieveBookmarkedArticle)', async () => {
  fetchMock.get('/bookmarks', { articles: [{ id: 1, title: 'Test Article' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Test Article')).toBeInTheDocument();
}, 10000);

test('fails to retrieve bookmarked articles with error message (from notifyTrendingArticles_retrieveBookmarkedArticle)', async () => {
  fetchMock.get('/bookmarks', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load bookmarks')).toBeInTheDocument();
}, 10000);

test('comments on an article successfully (from commentOnArticle_trackArticleLikeCount)', async () => {
  fetchMock.post('/comment', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Write a comment'), { target: { value: 'Great article!' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Post')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Comment posted')).toBeInTheDocument();
}, 10000);

test('fails to comment on an article with error message (from commentOnArticle_trackArticleLikeCount)', async () => {
  fetchMock.post('/comment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Write a comment'), { target: { value: 'Great article!' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Post')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to post comment')).toBeInTheDocument();
}, 10000);

test('Tracks article like count successfully. (from commentOnArticle_trackArticleLikeCount)', async () => {
  fetchMock.post('/api/trackLike', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like Article')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Like Count Tracked')).toBeInTheDocument();
}, 10000);

test('Fails to track article like count. (from commentOnArticle_trackArticleLikeCount)', async () => {
  fetchMock.post('/api/trackLike', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like Article')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to track like count')).toBeInTheDocument();
}, 10000);


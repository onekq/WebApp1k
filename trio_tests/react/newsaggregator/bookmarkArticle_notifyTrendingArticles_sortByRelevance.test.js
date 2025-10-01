import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './bookmarkArticle_notifyTrendingArticles_sortByRelevance';

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

test('Notifies user about trending articles successfully.', async () => {
  fetchMock.post('/api/notifyTrendingArticles', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Trending Articles')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Trending articles notification sent')).toBeInTheDocument();
}, 10000);

test('Fails to notify user about trending articles.', async () => {
  fetchMock.post('/api/notifyTrendingArticles', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Trending Articles')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to notify')).toBeInTheDocument();
}, 10000);

test('Sorts articles by relevance successfully', async () => {
  fetchMock.get('/api/articles?sort=relevance', { status: 200, body: [{ id: 1, relevance: 100 }] });

  await act(async () => { render(<MemoryRouter><App sortBy="relevance" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('100')).toBeInTheDocument();
}, 10000);

test('Fails to sort articles by relevance', async () => {
  fetchMock.get('/api/articles?sort=relevance', { status: 500 });

  await act(async () => { render(<MemoryRouter><App sortBy="relevance" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort articles by relevance')).toBeInTheDocument();
}, 10000);

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './notifyTrendingArticles_retrieveBookmarkedArticle';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('retrieves bookmarked articles successfully', async () => {
  fetchMock.get('/bookmarks', { articles: [{ id: 1, title: 'Test Article' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Test Article')).toBeInTheDocument();
}, 10000);

test('fails to retrieve bookmarked articles with error message', async () => {
  fetchMock.get('/bookmarks', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load bookmarks')).toBeInTheDocument();
}, 10000);
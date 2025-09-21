import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayArticlePreviews_expandArticlePreview_notifyTrendingArticles';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Displays article previews on the home page successfully', async () => {
  fetchMock.get('/api/articles', { status: 200, body: [{ id: 1, title: 'Test Article', preview: 'Test Preview' }] });

  await act(async () => { render(<MemoryRouter><HomePage /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Test Article')).toBeInTheDocument();
}, 10000);

test('Fails to display article previews on the home page', async () => {
  fetchMock.get('/api/articles', { status: 500 });

  await act(async () => { render(<MemoryRouter><HomePage /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load articles')).toBeInTheDocument();
}, 10000);

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

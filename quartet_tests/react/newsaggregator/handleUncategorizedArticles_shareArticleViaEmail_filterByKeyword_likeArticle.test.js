import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './handleUncategorizedArticles_shareArticleViaEmail_filterByKeyword_likeArticle';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Handle uncategorized articles successfully. (from handleUncategorizedArticles_shareArticleViaEmail)', async () => {
  fetchMock.get('/api/uncategorized-articles', [
    { id: 1, title: "Uncategorized Article 1" }
  ]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Uncategorized Article 1")).toBeInTheDocument();
}, 10000);

test('Fail to handle uncategorized articles and display error. (from handleUncategorizedArticles_shareArticleViaEmail)', async () => {
  fetchMock.get('/api/uncategorized-articles', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error fetching uncategorized articles.")).toBeInTheDocument();
}, 10000);

test('shares an article via email successfully (from handleUncategorizedArticles_shareArticleViaEmail)', async () => {
  fetchMock.post('/share/email', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Email')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shared via email')).toBeInTheDocument();
}, 10000);

test('fails to share an article via email with error message (from handleUncategorizedArticles_shareArticleViaEmail)', async () => {
  fetchMock.post('/share/email', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Email')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to share via email')).toBeInTheDocument();
}, 10000);

test('Searches articles by keyword successfully (from filterByKeyword_likeArticle)', async () => {
  fetchMock.get('/api/articles?search=keyword', { status: 200, body: [{ id: 1, title: 'Test Keyword' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'keyword' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Test Keyword')).toBeInTheDocument();
}, 10000);

test('Fails to search articles by keyword (from filterByKeyword_likeArticle)', async () => {
  fetchMock.get('/api/articles?search=keyword', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'keyword' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No articles found for keyword')).toBeInTheDocument();
}, 10000);

test('likes an article successfully (from filterByKeyword_likeArticle)', async () => {
  fetchMock.post('/like', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Liked')).toBeInTheDocument();
}, 10000);

test('fails to like an article with error message (from filterByKeyword_likeArticle)', async () => {
  fetchMock.post('/like', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to like')).toBeInTheDocument();
}, 10000);


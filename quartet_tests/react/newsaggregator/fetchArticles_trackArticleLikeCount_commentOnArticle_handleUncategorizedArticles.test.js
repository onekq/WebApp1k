import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchArticles_trackArticleLikeCount_commentOnArticle_handleUncategorizedArticles';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Fetch articles from multiple sources successfully. (from fetchArticles_trackArticleLikeCount)', async () => {
  fetchMock.get('/api/articles', [
    { id: 1, title: "Article 1" },
    { id: 2, title: "Article 2" }
  ]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Article 1")).toBeInTheDocument();
}, 10000);

test('Fail to fetch articles and display error. (from fetchArticles_trackArticleLikeCount)', async () => {
  fetchMock.get('/api/articles', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error fetching articles.")).toBeInTheDocument();
}, 10000);

test('Tracks article like count successfully. (from fetchArticles_trackArticleLikeCount)', async () => {
  fetchMock.post('/api/trackLike', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like Article')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Like Count Tracked')).toBeInTheDocument();
}, 10000);

test('Fails to track article like count. (from fetchArticles_trackArticleLikeCount)', async () => {
  fetchMock.post('/api/trackLike', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like Article')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to track like count')).toBeInTheDocument();
}, 10000);

test('comments on an article successfully (from commentOnArticle_handleUncategorizedArticles)', async () => {
  fetchMock.post('/comment', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Write a comment'), { target: { value: 'Great article!' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Post')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Comment posted')).toBeInTheDocument();
}, 10000);

test('fails to comment on an article with error message (from commentOnArticle_handleUncategorizedArticles)', async () => {
  fetchMock.post('/comment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Write a comment'), { target: { value: 'Great article!' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Post')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to post comment')).toBeInTheDocument();
}, 10000);

test('Handle uncategorized articles successfully. (from commentOnArticle_handleUncategorizedArticles)', async () => {
  fetchMock.get('/api/uncategorized-articles', [
    { id: 1, title: "Uncategorized Article 1" }
  ]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Uncategorized Article 1")).toBeInTheDocument();
}, 10000);

test('Fail to handle uncategorized articles and display error. (from commentOnArticle_handleUncategorizedArticles)', async () => {
  fetchMock.get('/api/uncategorized-articles', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error fetching uncategorized articles.")).toBeInTheDocument();
}, 10000);


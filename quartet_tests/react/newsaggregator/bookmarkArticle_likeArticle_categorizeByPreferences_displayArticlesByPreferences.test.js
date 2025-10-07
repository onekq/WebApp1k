import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './bookmarkArticle_likeArticle_categorizeByPreferences_displayArticlesByPreferences';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('bookmarks an article successfully (from bookmarkArticle_likeArticle)', async () => {
  fetchMock.post('/bookmark', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Bookmark')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Article bookmarked')).toBeInTheDocument();
}, 10000);

test('fails to bookmark an article with error message (from bookmarkArticle_likeArticle)', async () => {
  fetchMock.post('/bookmark', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Bookmark')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to bookmark')).toBeInTheDocument();
}, 10000);

test('likes an article successfully (from bookmarkArticle_likeArticle)', async () => {
  fetchMock.post('/like', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Liked')).toBeInTheDocument();
}, 10000);

test('fails to like an article with error message (from bookmarkArticle_likeArticle)', async () => {
  fetchMock.post('/like', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to like')).toBeInTheDocument();
}, 10000);

test('Categorize articles based on user preferences successfully. (from categorizeByPreferences_displayArticlesByPreferences)', async () => {
  fetchMock.post('/api/preferences-categorize-articles', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Categorize by Preferences")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Articles categorized by preferences successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to categorize articles by preferences and display error. (from categorizeByPreferences_displayArticlesByPreferences)', async () => {
  fetchMock.post('/api/preferences-categorize-articles', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Categorize by Preferences")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error categorizing by preferences.")).toBeInTheDocument();
}, 10000);

test('displays articles based on user preferences successfully (from categorizeByPreferences_displayArticlesByPreferences)', async () => {
  fetchMock.get('/api/articles?preferences=true', { status: 200, body: [{ id: 5, title: 'Preferred News' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('display-preferences-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Preferred News')).toBeInTheDocument();
}, 10000);

test('fails to display articles based on user preferences (from categorizeByPreferences_displayArticlesByPreferences)', async () => {
  fetchMock.get('/api/articles?preferences=true', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('display-preferences-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load preference-based articles')).toBeInTheDocument();
}, 10000);


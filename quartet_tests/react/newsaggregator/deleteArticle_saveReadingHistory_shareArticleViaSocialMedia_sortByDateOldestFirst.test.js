import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteArticle_saveReadingHistory_shareArticleViaSocialMedia_sortByDateOldestFirst';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Delete saved article successfully. (from deleteArticle_saveReadingHistory)', async () => {
  fetchMock.post('/api/delete-article', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Delete Article")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Article deleted successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to delete saved article and display error. (from deleteArticle_saveReadingHistory)', async () => {
  fetchMock.post('/api/delete-article', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Delete Article")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error deleting article.")).toBeInTheDocument();
}, 10000);

test('Saves user reading history successfully. (from deleteArticle_saveReadingHistory)', async () => {
  fetchMock.post('/api/readingHistory', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('article'), { target: { value: 'New article' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('History Saved')).toBeInTheDocument();
}, 10000);

test('Fails to save user reading history. (from deleteArticle_saveReadingHistory)', async () => {
  fetchMock.post('/api/readingHistory', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('article'), { target: { value: 'New article' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to save history')).toBeInTheDocument();
}, 10000);

test('shares an article via social media successfully (from shareArticleViaSocialMedia_sortByDateOldestFirst)', async () => {
  fetchMock.post('/share/social-media', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shared on social media')).toBeInTheDocument();
}, 10000);

test('fails to share an article via social media with error message (from shareArticleViaSocialMedia_sortByDateOldestFirst)', async () => {
  fetchMock.post('/share/social-media', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to share on social media')).toBeInTheDocument();
}, 10000);

test('Sorts articles by date (oldest first) successfully (from shareArticleViaSocialMedia_sortByDateOldestFirst)', async () => {
  fetchMock.get('/api/articles?sort=oldest', { status: 200, body: [{ id: 1, date: '2020-01-01' }] });

  await act(async () => { render(<MemoryRouter><App sortBy="oldest" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('2020-01-01')).toBeInTheDocument();
}, 10000);

test('Fails to sort articles by date (oldest first) (from shareArticleViaSocialMedia_sortByDateOldestFirst)', async () => {
  fetchMock.get('/api/articles?sort=oldest', { status: 500 });

  await act(async () => { render(<MemoryRouter><App sortBy="oldest" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort articles by date')).toBeInTheDocument();
}, 10000);


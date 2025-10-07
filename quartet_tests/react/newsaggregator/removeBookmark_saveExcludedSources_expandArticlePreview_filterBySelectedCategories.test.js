import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './removeBookmark_saveExcludedSources_expandArticlePreview_filterBySelectedCategories';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('removes a bookmark from an article successfully (from removeBookmark_saveExcludedSources)', async () => {
  fetchMock.delete('/bookmark/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove Bookmark')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Bookmark removed')).toBeInTheDocument();
}, 10000);

test('fails to remove a bookmark from an article with error message (from removeBookmark_saveExcludedSources)', async () => {
  fetchMock.delete('/bookmark/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove Bookmark')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to remove bookmark')).toBeInTheDocument();
}, 10000);

test('saves user-excluded sources successfully (from removeBookmark_saveExcludedSources)', async () => {
  fetchMock.post('/api/save-excluded-sources', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-sources-input'), { target: { value: 'CNN' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-excluded-sources-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Excluded sources saved')).toBeInTheDocument();
}, 10000);

test('fails to save user-excluded sources (from removeBookmark_saveExcludedSources)', async () => {
  fetchMock.post('/api/save-excluded-sources', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-sources-input'), { target: { value: 'CNN' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-excluded-sources-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save excluded sources')).toBeInTheDocument();
}, 10000);

test('Allows users to expand article previews to full articles successfully (from expandArticlePreview_filterBySelectedCategories)', async () => {
  fetchMock.get('/api/articles/1', { status: 200, body: { id: 1, content: 'Full Test Article Content' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Test Article')); });

  expect(fetchMock.calls()).toHaveLength(2);
  expect(screen.getByText('Full Test Article Content')).toBeInTheDocument();
}, 10000);

test('Fails to expand article previews to full articles (from expandArticlePreview_filterBySelectedCategories)', async () => {
  fetchMock.get('/api/articles/1', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Test Article')); });

  expect(fetchMock.calls()).toHaveLength(2);
  expect(screen.getByText('Failed to load full article')).toBeInTheDocument();
}, 10000);

test('filters articles by selected categories successfully (from expandArticlePreview_filterBySelectedCategories)', async () => {
  fetchMock.get('/api/articles?categories=Tech', { status: 200, body: [{ id: 1, title: 'Tech News' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('categories-filter-input'), { target: { value: 'Tech' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-categories-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Tech News')).toBeInTheDocument();
}, 10000);

test('fails to filter articles by selected categories (from expandArticlePreview_filterBySelectedCategories)', async () => {
  fetchMock.get('/api/articles?categories=Tech', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('categories-filter-input'), { target: { value: 'Tech' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-categories-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter articles')).toBeInTheDocument();
}, 10000);


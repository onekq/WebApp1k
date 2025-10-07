import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './saveSelectedCategories_updateArticleMetadata_handleUncategorizedArticles_trackArticleLikeCount';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('saves user-selected categories successfully (from saveSelectedCategories_updateArticleMetadata)', async () => {
  fetchMock.post('/api/save-categories', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('categories-input'), { target: { value: 'Tech' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-categories-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Categories saved')).toBeInTheDocument();
}, 10000);

test('fails to save user-selected categories (from saveSelectedCategories_updateArticleMetadata)', async () => {
  fetchMock.post('/api/save-categories', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('categories-input'), { target: { value: 'Tech' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-categories-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save categories')).toBeInTheDocument();
}, 10000);

test('Update article metadata successfully. (from saveSelectedCategories_updateArticleMetadata)', async () => {
  fetchMock.post('/api/update-article-metadata', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Update Metadata")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Metadata updated successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to update article metadata and display error. (from saveSelectedCategories_updateArticleMetadata)', async () => {
  fetchMock.post('/api/update-article-metadata', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Update Metadata")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error updating metadata.")).toBeInTheDocument();
}, 10000);

test('Handle uncategorized articles successfully. (from handleUncategorizedArticles_trackArticleLikeCount)', async () => {
  fetchMock.get('/api/uncategorized-articles', [
    { id: 1, title: "Uncategorized Article 1" }
  ]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Uncategorized Article 1")).toBeInTheDocument();
}, 10000);

test('Fail to handle uncategorized articles and display error. (from handleUncategorizedArticles_trackArticleLikeCount)', async () => {
  fetchMock.get('/api/uncategorized-articles', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error fetching uncategorized articles.")).toBeInTheDocument();
}, 10000);

test('Tracks article like count successfully. (from handleUncategorizedArticles_trackArticleLikeCount)', async () => {
  fetchMock.post('/api/trackLike', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like Article')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Like Count Tracked')).toBeInTheDocument();
}, 10000);

test('Fails to track article like count. (from handleUncategorizedArticles_trackArticleLikeCount)', async () => {
  fetchMock.post('/api/trackLike', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like Article')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to track like count')).toBeInTheDocument();
}, 10000);


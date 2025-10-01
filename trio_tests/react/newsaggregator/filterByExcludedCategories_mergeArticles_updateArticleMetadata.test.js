import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByExcludedCategories_mergeArticles_updateArticleMetadata';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('filters articles by excluded categories successfully', async () => {
  fetchMock.get('/api/articles?excludedCategories=Sports', { status: 200, body: [{ id: 2, title: 'Non-Sports News' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-categories-filter-input'), { target: { value: 'Sports' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-excluded-categories-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Non-Sports News')).toBeInTheDocument();
}, 10000);

test('fails to filter articles by excluded categories', async () => {
  fetchMock.get('/api/articles?excludedCategories=Sports', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-categories-filter-input'), { target: { value: 'Sports' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-excluded-categories-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter articles')).toBeInTheDocument();
}, 10000);

test('Merge articles from different sources successfully.', async () => {
  fetchMock.post('/api/merge-articles', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Merge Articles")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Articles merged successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to merge articles and display error.', async () => {
  fetchMock.post('/api/merge-articles', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Merge Articles")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error merging articles.")).toBeInTheDocument();
}, 10000);

test('Update article metadata successfully.', async () => {
  fetchMock.post('/api/update-article-metadata', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Update Metadata")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Metadata updated successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to update article metadata and display error.', async () => {
  fetchMock.post('/api/update-article-metadata', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Update Metadata")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error updating metadata.")).toBeInTheDocument();
}, 10000);

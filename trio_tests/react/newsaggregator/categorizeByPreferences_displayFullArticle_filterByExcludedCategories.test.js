import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './categorizeByPreferences_displayFullArticle_filterByExcludedCategories';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Categorize articles based on user preferences successfully.', async () => {
  fetchMock.post('/api/preferences-categorize-articles', { success: true });

  await act(async () => { render(<MemoryRouter><CategorizeByPreferences /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Categorize by Preferences")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Articles categorized by preferences successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to categorize articles by preferences and display error.', async () => {
  fetchMock.post('/api/preferences-categorize-articles', 500);

  await act(async () => { render(<MemoryRouter><CategorizeByPreferences /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Categorize by Preferences")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error categorizing by preferences.")).toBeInTheDocument();
}, 10000);

test('Displays full article content successfully', async () => {
  fetchMock.get('/api/articles', { status: 200, body: [{ id: 1, content: 'Full Test Article Content' }] });

  await act(async () => { render(<MemoryRouter><ArticlePage /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Full Test Article Content')).toBeInTheDocument();
}, 10000);

test('Fails to display full article content', async () => {
  fetchMock.get('/api/articles', { status: 500 });

  await act(async () => { render(<MemoryRouter><ArticlePage /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load full article content')).toBeInTheDocument();
}, 10000);

test('filters articles by excluded categories successfully', async () => {
  fetchMock.get('/api/articles?excludedCategories=Sports', { status: 200, body: [{ id: 2, title: 'Non-Sports News' }] });

  await act(async () => { render(<MemoryRouter><NewsPlatform /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-categories-filter-input'), { target: { value: 'Sports' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-excluded-categories-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Non-Sports News')).toBeInTheDocument();
}, 10000);

test('fails to filter articles by excluded categories', async () => {
  fetchMock.get('/api/articles?excludedCategories=Sports', { status: 500 });

  await act(async () => { render(<MemoryRouter><NewsPlatform /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-categories-filter-input'), { target: { value: 'Sports' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-excluded-categories-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter articles')).toBeInTheDocument();
}, 10000);

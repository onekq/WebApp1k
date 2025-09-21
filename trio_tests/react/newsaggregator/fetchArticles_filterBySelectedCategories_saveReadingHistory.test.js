import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchArticles_filterBySelectedCategories_saveReadingHistory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Fetch articles from multiple sources successfully.', async () => {
  fetchMock.get('/api/articles', [
    { id: 1, title: "Article 1" },
    { id: 2, title: "Article 2" }
  ]);

  await act(async () => { render(<MemoryRouter><Articles /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Article 1")).toBeInTheDocument();
}, 10000);

test('Fail to fetch articles and display error.', async () => {
  fetchMock.get('/api/articles', 500);

  await act(async () => { render(<MemoryRouter><Articles /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error fetching articles.")).toBeInTheDocument();
}, 10000);

test('filters articles by selected categories successfully', async () => {
  fetchMock.get('/api/articles?categories=Tech', { status: 200, body: [{ id: 1, title: 'Tech News' }] });

  await act(async () => { render(<MemoryRouter><NewsPlatform /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('categories-filter-input'), { target: { value: 'Tech' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-categories-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Tech News')).toBeInTheDocument();
}, 10000);

test('fails to filter articles by selected categories', async () => {
  fetchMock.get('/api/articles?categories=Tech', { status: 500 });

  await act(async () => { render(<MemoryRouter><NewsPlatform /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('categories-filter-input'), { target: { value: 'Tech' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-categories-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter articles')).toBeInTheDocument();
}, 10000);

test('Saves user reading history successfully.', async () => {
  fetchMock.post('/api/readingHistory', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('article'), { target: { value: 'New article' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('History Saved')).toBeInTheDocument();
}, 10000);

test('Fails to save user reading history.', async () => {
  fetchMock.post('/api/readingHistory', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('article'), { target: { value: 'New article' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to save history')).toBeInTheDocument();
}, 10000);

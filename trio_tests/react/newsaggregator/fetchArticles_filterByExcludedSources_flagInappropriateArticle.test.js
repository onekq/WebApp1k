import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchArticles_filterByExcludedSources_flagInappropriateArticle';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Fetch articles from multiple sources successfully.', async () => {
  fetchMock.get('/api/articles', [
    { id: 1, title: "Article 1" },
    { id: 2, title: "Article 2" }
  ]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Article 1")).toBeInTheDocument();
}, 10000);

test('Fail to fetch articles and display error.', async () => {
  fetchMock.get('/api/articles', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error fetching articles.")).toBeInTheDocument();
}, 10000);

test('filters articles by excluded sources successfully', async () => {
  fetchMock.get('/api/articles?excludedSources=CNN', { status: 200, body: [{ id: 4, title: 'Non-CNN News' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-sources-filter-input'), { target: { value: 'CNN' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-excluded-sources-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Non-CNN News')).toBeInTheDocument();
}, 10000);

test('fails to filter articles by excluded sources', async () => {
  fetchMock.get('/api/articles?excludedSources=CNN', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-sources-filter-input'), { target: { value: 'CNN' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-excluded-sources-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter articles')).toBeInTheDocument();
}, 10000);

test('Flag inappropriate article successfully.', async () => {
  fetchMock.post('/api/flag-article', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Flag Article")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Article flagged successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to flag inappropriate article and display error.', async () => {
  fetchMock.post('/api/flag-article', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Flag Article")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error flagging article.")).toBeInTheDocument();
}, 10000);

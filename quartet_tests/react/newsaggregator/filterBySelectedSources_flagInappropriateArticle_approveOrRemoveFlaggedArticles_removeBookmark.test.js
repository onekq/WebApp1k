import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterBySelectedSources_flagInappropriateArticle_approveOrRemoveFlaggedArticles_removeBookmark';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('filters articles by selected sources successfully (from filterBySelectedSources_flagInappropriateArticle)', async () => {
  fetchMock.get('/api/articles?sources=BBC', { status: 200, body: [{ id: 3, title: 'BBC News' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sources-filter-input'), { target: { value: 'BBC' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-sources-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('BBC News')).toBeInTheDocument();
}, 10000);

test('fails to filter articles by selected sources (from filterBySelectedSources_flagInappropriateArticle)', async () => {
  fetchMock.get('/api/articles?sources=BBC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sources-filter-input'), { target: { value: 'BBC' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-sources-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter articles')).toBeInTheDocument();
}, 10000);

test('Flag inappropriate article successfully. (from filterBySelectedSources_flagInappropriateArticle)', async () => {
  fetchMock.post('/api/flag-article', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Flag Article")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Article flagged successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to flag inappropriate article and display error. (from filterBySelectedSources_flagInappropriateArticle)', async () => {
  fetchMock.post('/api/flag-article', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Flag Article")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error flagging article.")).toBeInTheDocument();
}, 10000);

test('Approve or remove flagged articles successfully. (from approveOrRemoveFlaggedArticles_removeBookmark)', async () => {
  fetchMock.post('/api/moderate-articles', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Moderate Articles")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Articles moderated successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to approve or remove flagged articles and display error. (from approveOrRemoveFlaggedArticles_removeBookmark)', async () => {
  fetchMock.post('/api/moderate-articles', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Moderate Articles")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error moderating articles.")).toBeInTheDocument();
}, 10000);

test('removes a bookmark from an article successfully (from approveOrRemoveFlaggedArticles_removeBookmark)', async () => {
  fetchMock.delete('/bookmark/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove Bookmark')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Bookmark removed')).toBeInTheDocument();
}, 10000);

test('fails to remove a bookmark from an article with error message (from approveOrRemoveFlaggedArticles_removeBookmark)', async () => {
  fetchMock.delete('/bookmark/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove Bookmark')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to remove bookmark')).toBeInTheDocument();
}, 10000);


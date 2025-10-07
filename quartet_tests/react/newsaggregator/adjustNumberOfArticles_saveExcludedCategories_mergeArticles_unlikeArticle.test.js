import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './adjustNumberOfArticles_saveExcludedCategories_mergeArticles_unlikeArticle';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('adjusts the number of articles shown successfully (from adjustNumberOfArticles_saveExcludedCategories)', async () => {
  fetchMock.get('/api/articles?limit=10', { status: 200, body: Array.from({ length: 10 }, (_, i) => ({ id: i, title: `Article ${i}` })) });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('articles-limit-input'), { target: { value: '10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('adjust-articles-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  Array.from({ length: 10 }, (_, i) => `Article ${i}`).forEach(title => expect(screen.getByText(title)).toBeInTheDocument());
}, 10000);

test('fails to adjust the number of articles shown (from adjustNumberOfArticles_saveExcludedCategories)', async () => {
  fetchMock.get('/api/articles?limit=10', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('articles-limit-input'), { target: { value: '10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('adjust-articles-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to adjust the number of articles')).toBeInTheDocument();
}, 10000);

test('saves user-excluded categories successfully (from adjustNumberOfArticles_saveExcludedCategories)', async () => {
  fetchMock.post('/api/save-excluded-categories', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-categories-input'), { target: { value: 'Sports' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-excluded-categories-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Excluded categories saved')).toBeInTheDocument();
}, 10000);

test('fails to save user-excluded categories (from adjustNumberOfArticles_saveExcludedCategories)', async () => {
  fetchMock.post('/api/save-excluded-categories', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-categories-input'), { target: { value: 'Sports' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-excluded-categories-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save excluded categories')).toBeInTheDocument();
}, 10000);

test('Merge articles from different sources successfully. (from mergeArticles_unlikeArticle)', async () => {
  fetchMock.post('/api/merge-articles', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Merge Articles")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Articles merged successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to merge articles and display error. (from mergeArticles_unlikeArticle)', async () => {
  fetchMock.post('/api/merge-articles', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Merge Articles")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error merging articles.")).toBeInTheDocument();
}, 10000);

test('unlikes an article successfully (from mergeArticles_unlikeArticle)', async () => {
  fetchMock.post('/unlike', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Unlike')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Unliked')).toBeInTheDocument();
}, 10000);

test('fails to unlike an article with error message (from mergeArticles_unlikeArticle)', async () => {
  fetchMock.post('/unlike', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Unlike')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to unlike')).toBeInTheDocument();
}, 10000);


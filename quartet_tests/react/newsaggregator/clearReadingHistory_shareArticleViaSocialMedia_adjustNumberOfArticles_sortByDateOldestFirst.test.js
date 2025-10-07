import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './clearReadingHistory_shareArticleViaSocialMedia_adjustNumberOfArticles_sortByDateOldestFirst';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Clears user reading history successfully. (from clearReadingHistory_shareArticleViaSocialMedia)', async () => {
  fetchMock.post('/api/clearHistory', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Clear History')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('History Cleared')).toBeInTheDocument();
}, 10000);

test('Fails to clear user reading history. (from clearReadingHistory_shareArticleViaSocialMedia)', async () => {
  fetchMock.post('/api/clearHistory', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Clear History')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to clear history')).toBeInTheDocument();
}, 10000);

test('shares an article via social media successfully (from clearReadingHistory_shareArticleViaSocialMedia)', async () => {
  fetchMock.post('/share/social-media', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shared on social media')).toBeInTheDocument();
}, 10000);

test('fails to share an article via social media with error message (from clearReadingHistory_shareArticleViaSocialMedia)', async () => {
  fetchMock.post('/share/social-media', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to share on social media')).toBeInTheDocument();
}, 10000);

test('adjusts the number of articles shown successfully (from adjustNumberOfArticles_sortByDateOldestFirst)', async () => {
  fetchMock.get('/api/articles?limit=10', { status: 200, body: Array.from({ length: 10 }, (_, i) => ({ id: i, title: `Article ${i}` })) });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('articles-limit-input'), { target: { value: '10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('adjust-articles-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  Array.from({ length: 10 }, (_, i) => `Article ${i}`).forEach(title => expect(screen.getByText(title)).toBeInTheDocument());
}, 10000);

test('fails to adjust the number of articles shown (from adjustNumberOfArticles_sortByDateOldestFirst)', async () => {
  fetchMock.get('/api/articles?limit=10', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('articles-limit-input'), { target: { value: '10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('adjust-articles-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to adjust the number of articles')).toBeInTheDocument();
}, 10000);

test('Sorts articles by date (oldest first) successfully (from adjustNumberOfArticles_sortByDateOldestFirst)', async () => {
  fetchMock.get('/api/articles?sort=oldest', { status: 200, body: [{ id: 1, date: '2020-01-01' }] });

  await act(async () => { render(<MemoryRouter><App sortBy="oldest" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('2020-01-01')).toBeInTheDocument();
}, 10000);

test('Fails to sort articles by date (oldest first) (from adjustNumberOfArticles_sortByDateOldestFirst)', async () => {
  fetchMock.get('/api/articles?sort=oldest', { status: 500 });

  await act(async () => { render(<MemoryRouter><App sortBy="oldest" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort articles by date')).toBeInTheDocument();
}, 10000);


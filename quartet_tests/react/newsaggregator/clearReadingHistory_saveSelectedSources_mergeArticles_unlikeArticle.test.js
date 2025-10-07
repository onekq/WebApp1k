import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './clearReadingHistory_saveSelectedSources_mergeArticles_unlikeArticle';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Clears user reading history successfully. (from clearReadingHistory_saveSelectedSources)', async () => {
  fetchMock.post('/api/clearHistory', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Clear History')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('History Cleared')).toBeInTheDocument();
}, 10000);

test('Fails to clear user reading history. (from clearReadingHistory_saveSelectedSources)', async () => {
  fetchMock.post('/api/clearHistory', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Clear History')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to clear history')).toBeInTheDocument();
}, 10000);

test('saves user-selected sources successfully (from clearReadingHistory_saveSelectedSources)', async () => {
  fetchMock.post('/api/save-sources', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sources-input'), { target: { value: 'BBC' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-sources-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sources saved')).toBeInTheDocument();
}, 10000);

test('fails to save user-selected sources (from clearReadingHistory_saveSelectedSources)', async () => {
  fetchMock.post('/api/save-sources', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sources-input'), { target: { value: 'BBC' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-sources-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save sources')).toBeInTheDocument();
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


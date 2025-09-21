import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './mergeArticles_retrieveReadingHistory_saveSelectedCategories';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Merge articles from different sources successfully.', async () => {
  fetchMock.post('/api/merge-articles', { success: true });

  await act(async () => { render(<MemoryRouter><MergeArticles /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Merge Articles")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Articles merged successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to merge articles and display error.', async () => {
  fetchMock.post('/api/merge-articles', 500);

  await act(async () => { render(<MemoryRouter><MergeArticles /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Merge Articles")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error merging articles.")).toBeInTheDocument();
}, 10000);

test('Retrieves user reading history successfully.', async () => {
  fetchMock.get('/api/readingHistory', { status: 200, body: { history: ['Article 1'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View History')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Article 1')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve user reading history.', async () => {
  fetchMock.get('/api/readingHistory', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View History')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error loading history')).toBeInTheDocument();
}, 10000);

test('saves user-selected categories successfully', async () => {
  fetchMock.post('/api/save-categories', { status: 200 });

  await act(async () => { render(<MemoryRouter><NewsPlatform /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('categories-input'), { target: { value: 'Tech' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-categories-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Categories saved')).toBeInTheDocument();
}, 10000);

test('fails to save user-selected categories', async () => {
  fetchMock.post('/api/save-categories', { status: 500 });

  await act(async () => { render(<MemoryRouter><NewsPlatform /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('categories-input'), { target: { value: 'Tech' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-categories-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save categories')).toBeInTheDocument();
}, 10000);

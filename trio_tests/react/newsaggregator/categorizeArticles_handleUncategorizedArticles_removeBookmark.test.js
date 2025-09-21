import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './categorizeArticles_handleUncategorizedArticles_removeBookmark';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Categorize articles based on predefined categories successfully.', async () => {
  fetchMock.post('/api/categorize-articles', { success: true });

  await act(async () => { render(<MemoryRouter><CategorizeArticles /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Categorize")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Articles categorized successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to categorize articles and display error.', async () => {
  fetchMock.post('/api/categorize-articles', 500);

  await act(async () => { render(<MemoryRouter><CategorizeArticles /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Categorize")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error categorizing articles.")).toBeInTheDocument();
}, 10000);

test('Handle uncategorized articles successfully.', async () => {
  fetchMock.get('/api/uncategorized-articles', [
    { id: 1, title: "Uncategorized Article 1" }
  ]);

  await act(async () => { render(<MemoryRouter><UncategorizedArticles /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Uncategorized Article 1")).toBeInTheDocument();
}, 10000);

test('Fail to handle uncategorized articles and display error.', async () => {
  fetchMock.get('/api/uncategorized-articles', 500);

  await act(async () => { render(<MemoryRouter><UncategorizedArticles /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error fetching uncategorized articles.")).toBeInTheDocument();
}, 10000);

test('removes a bookmark from an article successfully', async () => {
  fetchMock.delete('/bookmark/1', 200);

  await act(async () => { render(<MemoryRouter><RemoveBookmarkComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove Bookmark')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Bookmark removed')).toBeInTheDocument();
}, 10000);

test('fails to remove a bookmark from an article with error message', async () => {
  fetchMock.delete('/bookmark/1', 500);

  await act(async () => { render(<MemoryRouter><RemoveBookmarkComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove Bookmark')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to remove bookmark')).toBeInTheDocument();
}, 10000);

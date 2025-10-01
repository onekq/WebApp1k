import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchArticles_filterByKeyword_saveSelectedSources';

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

test('Searches articles by keyword successfully', async () => {
  fetchMock.get('/api/articles?search=keyword', { status: 200, body: [{ id: 1, title: 'Test Keyword' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'keyword' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Test Keyword')).toBeInTheDocument();
}, 10000);

test('Fails to search articles by keyword', async () => {
  fetchMock.get('/api/articles?search=keyword', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'keyword' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No articles found for keyword')).toBeInTheDocument();
}, 10000);

test('saves user-selected sources successfully', async () => {
  fetchMock.post('/api/save-sources', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sources-input'), { target: { value: 'BBC' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-sources-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sources saved')).toBeInTheDocument();
}, 10000);

test('fails to save user-selected sources', async () => {
  fetchMock.post('/api/save-sources', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sources-input'), { target: { value: 'BBC' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-sources-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save sources')).toBeInTheDocument();
}, 10000);

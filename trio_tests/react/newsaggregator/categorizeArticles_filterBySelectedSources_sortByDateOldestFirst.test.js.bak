import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './categorizeArticles_filterBySelectedSources_sortByDateOldestFirst';

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

test('filters articles by selected sources successfully', async () => {
  fetchMock.get('/api/articles?sources=BBC', { status: 200, body: [{ id: 3, title: 'BBC News' }] });

  await act(async () => { render(<MemoryRouter><NewsPlatform /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sources-filter-input'), { target: { value: 'BBC' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-sources-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('BBC News')).toBeInTheDocument();
}, 10000);

test('fails to filter articles by selected sources', async () => {
  fetchMock.get('/api/articles?sources=BBC', { status: 500 });

  await act(async () => { render(<MemoryRouter><NewsPlatform /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sources-filter-input'), { target: { value: 'BBC' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-sources-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter articles')).toBeInTheDocument();
}, 10000);

test('Sorts articles by date (oldest first) successfully', async () => {
  fetchMock.get('/api/articles?sort=oldest', { status: 200, body: [{ id: 1, date: '2020-01-01' }] });

  await act(async () => { render(<MemoryRouter><HomePage sortBy="oldest" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('2020-01-01')).toBeInTheDocument();
}, 10000);

test('Fails to sort articles by date (oldest first)', async () => {
  fetchMock.get('/api/articles?sort=oldest', { status: 500 });

  await act(async () => { render(<MemoryRouter><HomePage sortBy="oldest" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort articles by date')).toBeInTheDocument();
}, 10000);

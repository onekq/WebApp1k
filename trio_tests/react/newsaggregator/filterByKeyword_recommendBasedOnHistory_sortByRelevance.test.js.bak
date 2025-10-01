import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByKeyword_recommendBasedOnHistory_sortByRelevance';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Searches articles by keyword successfully', async () => {
  fetchMock.get('/api/articles?search=keyword', { status: 200, body: [{ id: 1, title: 'Test Keyword' }] });

  await act(async () => { render(<MemoryRouter><HomePage /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'keyword' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Test Keyword')).toBeInTheDocument();
}, 10000);

test('Fails to search articles by keyword', async () => {
  fetchMock.get('/api/articles?search=keyword', { status: 500 });

  await act(async () => { render(<MemoryRouter><HomePage /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'keyword' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No articles found for keyword')).toBeInTheDocument();
}, 10000);

test('Recommends articles based on user history successfully.', async () => {
  fetchMock.get('/api/recommendations/history', { status: 200, body: { recommendations: ['Article A'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Recommendations Based on History')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Article A')).toBeInTheDocument();
}, 10000);

test('Fails to recommend articles based on user history.', async () => {
  fetchMock.get('/api/recommendations/history', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Recommendations Based on History')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error retrieving recommendations')).toBeInTheDocument();
}, 10000);

test('Sorts articles by relevance successfully', async () => {
  fetchMock.get('/api/articles?sort=relevance', { status: 200, body: [{ id: 1, relevance: 100 }] });

  await act(async () => { render(<MemoryRouter><HomePage sortBy="relevance" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('100')).toBeInTheDocument();
}, 10000);

test('Fails to sort articles by relevance', async () => {
  fetchMock.get('/api/articles?sort=relevance', { status: 500 });

  await act(async () => { render(<MemoryRouter><HomePage sortBy="relevance" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort articles by relevance')).toBeInTheDocument();
}, 10000);

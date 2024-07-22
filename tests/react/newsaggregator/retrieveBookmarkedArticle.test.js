import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import RetrieveBookmarkedArticlesComponent from './retrieveBookmarkedArticle';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('retrieves bookmarked articles successfully', async () => {
  fetchMock.get('/bookmarks', { articles: [{ id: 1, title: 'Test Article' }] });

  await act(async () => { render(<MemoryRouter><RetrieveBookmarkedArticlesComponent /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Test Article')).toBeInTheDocument();
}, 10000);

test('fails to retrieve bookmarked articles with error message', async () => {
  fetchMock.get('/bookmarks', 500);

  await act(async () => { render(<MemoryRouter><RetrieveBookmarkedArticlesComponent /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load bookmarks')).toBeInTheDocument();
}, 10000);


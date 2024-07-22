import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ArticlePage from './displayFullArticle';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displays full article content successfully', async () => {
  fetchMock.get('/api/articles', { status: 200, body: [{ id: 1, content: 'Full Test Article Content' }] });

  await act(async () => { render(<MemoryRouter><ArticlePage /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Full Test Article Content')).toBeInTheDocument();
}, 10000);

test('Fails to display full article content', async () => {
  fetchMock.get('/api/articles', { status: 500 });

  await act(async () => { render(<MemoryRouter><ArticlePage /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load full article content')).toBeInTheDocument();
}, 10000);


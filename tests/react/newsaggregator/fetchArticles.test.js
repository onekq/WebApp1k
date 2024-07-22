import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Articles from './fetchArticles';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Fetch articles from multiple sources successfully.', async () => {
  fetchMock.get('/api/articles', [
    { id: 1, title: "Article 1" },
    { id: 2, title: "Article 2" }
  ]);

  await act(async () => { render(<MemoryRouter><Articles /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Article 1")).toBeInTheDocument();
}, 10000);

test('Fail to fetch articles and display error.', async () => {
  fetchMock.get('/api/articles', 500);

  await act(async () => { render(<MemoryRouter><Articles /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error fetching articles.")).toBeInTheDocument();
}, 10000);


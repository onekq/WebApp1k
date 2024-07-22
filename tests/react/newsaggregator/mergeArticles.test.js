import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MergeArticles from './mergeArticles';

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


import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteComment_recommendBasedOnHistory_retrieveBookmarkedArticle';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('deletes a comment successfully', async () => {
  fetchMock.delete('/comment/1', 200);

  await act(async () => { render(<MemoryRouter><DeleteCommentComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Comment deleted')).toBeInTheDocument();
}, 10000);

test('fails to delete a comment with error message', async () => {
  fetchMock.delete('/comment/1', 500);

  await act(async () => { render(<MemoryRouter><DeleteCommentComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to delete comment')).toBeInTheDocument();
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

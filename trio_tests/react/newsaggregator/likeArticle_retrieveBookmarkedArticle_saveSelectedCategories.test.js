import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './likeArticle_retrieveBookmarkedArticle_saveSelectedCategories';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('likes an article successfully', async () => {
  fetchMock.post('/like', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Liked')).toBeInTheDocument();
}, 10000);

test('fails to like an article with error message', async () => {
  fetchMock.post('/like', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to like')).toBeInTheDocument();
}, 10000);

test('retrieves bookmarked articles successfully', async () => {
  fetchMock.get('/bookmarks', { articles: [{ id: 1, title: 'Test Article' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Test Article')).toBeInTheDocument();
}, 10000);

test('fails to retrieve bookmarked articles with error message', async () => {
  fetchMock.get('/bookmarks', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load bookmarks')).toBeInTheDocument();
}, 10000);

test('saves user-selected categories successfully', async () => {
  fetchMock.post('/api/save-categories', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('categories-input'), { target: { value: 'Tech' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-categories-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Categories saved')).toBeInTheDocument();
}, 10000);

test('fails to save user-selected categories', async () => {
  fetchMock.post('/api/save-categories', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('categories-input'), { target: { value: 'Tech' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-categories-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save categories')).toBeInTheDocument();
}, 10000);

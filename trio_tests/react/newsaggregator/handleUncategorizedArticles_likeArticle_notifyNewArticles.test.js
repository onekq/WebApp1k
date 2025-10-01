import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './handleUncategorizedArticles_likeArticle_notifyNewArticles';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Handle uncategorized articles successfully.', async () => {
  fetchMock.get('/api/uncategorized-articles', [
    { id: 1, title: "Uncategorized Article 1" }
  ]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Uncategorized Article 1")).toBeInTheDocument();
}, 10000);

test('Fail to handle uncategorized articles and display error.', async () => {
  fetchMock.get('/api/uncategorized-articles', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error fetching uncategorized articles.")).toBeInTheDocument();
}, 10000);

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

test('Notifies user about new articles successfully.', async () => {
  fetchMock.post('/api/notifyNewArticles', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Notify New Articles')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('New articles notification sent')).toBeInTheDocument();
}, 10000);

test('Fails to notify user about new articles.', async () => {
  fetchMock.post('/api/notifyNewArticles', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Notify New Articles')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to notify')).toBeInTheDocument();
}, 10000);

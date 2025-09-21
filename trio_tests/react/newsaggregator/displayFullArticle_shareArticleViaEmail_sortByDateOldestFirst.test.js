import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayFullArticle_shareArticleViaEmail_sortByDateOldestFirst';

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

test('shares an article via email successfully', async () => {
  fetchMock.post('/share/email', 200);

  await act(async () => { render(<MemoryRouter><ShareViaEmailComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Email')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shared via email')).toBeInTheDocument();
}, 10000);

test('fails to share an article via email with error message', async () => {
  fetchMock.post('/share/email', 500);

  await act(async () => { render(<MemoryRouter><ShareViaEmailComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Email')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to share via email')).toBeInTheDocument();
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

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteComment_notifyNewArticles_sortByRelevance';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('deletes a comment successfully', async () => {
  fetchMock.delete('/comment/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Comment deleted')).toBeInTheDocument();
}, 10000);

test('fails to delete a comment with error message', async () => {
  fetchMock.delete('/comment/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to delete comment')).toBeInTheDocument();
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

test('Sorts articles by relevance successfully', async () => {
  fetchMock.get('/api/articles?sort=relevance', { status: 200, body: [{ id: 1, relevance: 100 }] });

  await act(async () => { render(<MemoryRouter><App sortBy="relevance" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('100')).toBeInTheDocument();
}, 10000);

test('Fails to sort articles by relevance', async () => {
  fetchMock.get('/api/articles?sort=relevance', { status: 500 });

  await act(async () => { render(<MemoryRouter><App sortBy="relevance" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort articles by relevance')).toBeInTheDocument();
}, 10000);

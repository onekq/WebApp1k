import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByKeyword_notifyNewArticles';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Searches articles by keyword successfully', async () => {
  fetchMock.get('/api/articles?search=keyword', { status: 200, body: [{ id: 1, title: 'Test Keyword' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'keyword' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Test Keyword')).toBeInTheDocument();
}, 10000);

test('Fails to search articles by keyword', async () => {
  fetchMock.get('/api/articles?search=keyword', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'keyword' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No articles found for keyword')).toBeInTheDocument();
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
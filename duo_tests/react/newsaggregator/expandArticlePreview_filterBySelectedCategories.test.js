import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './expandArticlePreview_filterBySelectedCategories';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Allows users to expand article previews to full articles successfully', async () => {
  fetchMock.get('/api/articles/1', { status: 200, body: { id: 1, content: 'Full Test Article Content' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Test Article')); });

  expect(fetchMock.calls()).toHaveLength(2);
  expect(screen.getByText('Full Test Article Content')).toBeInTheDocument();
}, 10000);

test('Fails to expand article previews to full articles', async () => {
  fetchMock.get('/api/articles/1', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Test Article')); });

  expect(fetchMock.calls()).toHaveLength(2);
  expect(screen.getByText('Failed to load full article')).toBeInTheDocument();
}, 10000);

test('filters articles by selected categories successfully', async () => {
  fetchMock.get('/api/articles?categories=Tech', { status: 200, body: [{ id: 1, title: 'Tech News' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('categories-filter-input'), { target: { value: 'Tech' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-categories-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Tech News')).toBeInTheDocument();
}, 10000);

test('fails to filter articles by selected categories', async () => {
  fetchMock.get('/api/articles?categories=Tech', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('categories-filter-input'), { target: { value: 'Tech' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-categories-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter articles')).toBeInTheDocument();
}, 10000);
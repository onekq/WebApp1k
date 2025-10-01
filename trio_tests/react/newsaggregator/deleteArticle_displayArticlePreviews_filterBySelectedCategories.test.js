import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteArticle_displayArticlePreviews_filterBySelectedCategories';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Delete saved article successfully.', async () => {
  fetchMock.post('/api/delete-article', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Delete Article")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Article deleted successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to delete saved article and display error.', async () => {
  fetchMock.post('/api/delete-article', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Delete Article")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error deleting article.")).toBeInTheDocument();
}, 10000);

test('Displays article previews on the home page successfully', async () => {
  fetchMock.get('/api/articles', { status: 200, body: [{ id: 1, title: 'Test Article', preview: 'Test Preview' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Test Article')).toBeInTheDocument();
}, 10000);

test('Fails to display article previews on the home page', async () => {
  fetchMock.get('/api/articles', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load articles')).toBeInTheDocument();
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

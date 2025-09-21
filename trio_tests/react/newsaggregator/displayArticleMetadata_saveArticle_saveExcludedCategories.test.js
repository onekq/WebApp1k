import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayArticleMetadata_saveArticle_saveExcludedCategories';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Displays article metadata successfully', async () => {
  fetchMock.get('/api/articles', { status: 200, body: [{ id: 1, author: 'Author', date: 'Date', source: 'Source' }] });

  await act(async () => { render(<MemoryRouter><HomePage /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Author')).toBeInTheDocument();
  expect(screen.getByText('Date')).toBeInTheDocument();
  expect(screen.getByText('Source')).toBeInTheDocument();
}, 10000);

test('Fails to display article metadata', async () => {
  fetchMock.get('/api/articles', { status: 500 });

  await act(async () => { render(<MemoryRouter><HomePage /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load article metadata')).toBeInTheDocument();
}, 10000);

test('Save article successfully.', async () => {
  fetchMock.post('/api/save-article', { success: true });

  await act(async () => { render(<MemoryRouter><SaveArticle /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Save Article")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Article saved successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to save article and display error.', async () => {
  fetchMock.post('/api/save-article', 500);

  await act(async () => { render(<MemoryRouter><SaveArticle /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Save Article")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error saving article.")).toBeInTheDocument();
}, 10000);

test('saves user-excluded categories successfully', async () => {
  fetchMock.post('/api/save-excluded-categories', { status: 200 });

  await act(async () => { render(<MemoryRouter><NewsPlatform /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-categories-input'), { target: { value: 'Sports' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-excluded-categories-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Excluded categories saved')).toBeInTheDocument();
}, 10000);

test('fails to save user-excluded categories', async () => {
  fetchMock.post('/api/save-excluded-categories', { status: 500 });

  await act(async () => { render(<MemoryRouter><NewsPlatform /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-categories-input'), { target: { value: 'Sports' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-excluded-categories-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save excluded categories')).toBeInTheDocument();
}, 10000);

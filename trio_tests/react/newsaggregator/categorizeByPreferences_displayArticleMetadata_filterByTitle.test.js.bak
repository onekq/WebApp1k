import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './categorizeByPreferences_displayArticleMetadata_filterByTitle';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Categorize articles based on user preferences successfully.', async () => {
  fetchMock.post('/api/preferences-categorize-articles', { success: true });

  await act(async () => { render(<MemoryRouter><CategorizeByPreferences /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Categorize by Preferences")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Articles categorized by preferences successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to categorize articles by preferences and display error.', async () => {
  fetchMock.post('/api/preferences-categorize-articles', 500);

  await act(async () => { render(<MemoryRouter><CategorizeByPreferences /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Categorize by Preferences")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error categorizing by preferences.")).toBeInTheDocument();
}, 10000);

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

test('Searches articles by title successfully', async () => {
  fetchMock.get('/api/articles?title=test', { status: 200, body: [{ id: 1, title: 'Test Title' }] });

  await act(async () => { render(<MemoryRouter><HomePage /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'test' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Test Title')).toBeInTheDocument();
}, 10000);

test('Fails to search articles by title', async () => {
  fetchMock.get('/api/articles?title=test', { status: 500 });

  await act(async () => { render(<MemoryRouter><HomePage /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'test' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No articles found for test')).toBeInTheDocument();
}, 10000);

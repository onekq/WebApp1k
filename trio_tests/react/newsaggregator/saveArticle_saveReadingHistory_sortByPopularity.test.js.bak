import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './saveArticle_saveReadingHistory_sortByPopularity';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('Saves user reading history successfully.', async () => {
  fetchMock.post('/api/readingHistory', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('article'), { target: { value: 'New article' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('History Saved')).toBeInTheDocument();
}, 10000);

test('Fails to save user reading history.', async () => {
  fetchMock.post('/api/readingHistory', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('article'), { target: { value: 'New article' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to save history')).toBeInTheDocument();
}, 10000);

test('Sorts articles by popularity successfully', async () => {
  fetchMock.get('/api/articles?sort=popularity', { status: 200, body: [{ id: 1, popularity: 1000 }] });

  await act(async () => { render(<MemoryRouter><HomePage sortBy="popularity" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('1000')).toBeInTheDocument();
}, 10000);

test('Fails to sort articles by popularity', async () => {
  fetchMock.get('/api/articles?sort=popularity', { status: 500 });

  await act(async () => { render(<MemoryRouter><HomePage sortBy="popularity" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort articles by popularity')).toBeInTheDocument();
}, 10000);

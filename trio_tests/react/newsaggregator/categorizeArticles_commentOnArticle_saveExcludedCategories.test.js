import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './categorizeArticles_commentOnArticle_saveExcludedCategories';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Categorize articles based on predefined categories successfully.', async () => {
  fetchMock.post('/api/categorize-articles', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Categorize")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Articles categorized successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to categorize articles and display error.', async () => {
  fetchMock.post('/api/categorize-articles', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Categorize")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error categorizing articles.")).toBeInTheDocument();
}, 10000);

test('comments on an article successfully', async () => {
  fetchMock.post('/comment', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Write a comment'), { target: { value: 'Great article!' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Post')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Comment posted')).toBeInTheDocument();
}, 10000);

test('fails to comment on an article with error message', async () => {
  fetchMock.post('/comment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Write a comment'), { target: { value: 'Great article!' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Post')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to post comment')).toBeInTheDocument();
}, 10000);

test('saves user-excluded categories successfully', async () => {
  fetchMock.post('/api/save-excluded-categories', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-categories-input'), { target: { value: 'Sports' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-excluded-categories-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Excluded categories saved')).toBeInTheDocument();
}, 10000);

test('fails to save user-excluded categories', async () => {
  fetchMock.post('/api/save-excluded-categories', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-categories-input'), { target: { value: 'Sports' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-excluded-categories-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save excluded categories')).toBeInTheDocument();
}, 10000);

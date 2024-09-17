import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteArticle_saveSelectedCategories';

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

test('saves user-selected categories successfully', async () => {
  fetchMock.post('/api/save-categories', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('categories-input'), { target: { value: 'Tech' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-categories-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Categories saved')).toBeInTheDocument();
}, 10000);

test('fails to save user-selected categories', async () => {
  fetchMock.post('/api/save-categories', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('categories-input'), { target: { value: 'Tech' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-categories-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save categories')).toBeInTheDocument();
}, 10000);
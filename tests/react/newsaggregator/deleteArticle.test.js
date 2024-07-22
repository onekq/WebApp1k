import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import DeleteArticle from './deleteArticle';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Delete saved article successfully.', async () => {
  fetchMock.post('/api/delete-article', { success: true });

  await act(async () => { render(<MemoryRouter><DeleteArticle /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Delete Article")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Article deleted successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to delete saved article and display error.', async () => {
  fetchMock.post('/api/delete-article', 500);

  await act(async () => { render(<MemoryRouter><DeleteArticle /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Delete Article")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error deleting article.")).toBeInTheDocument();
}, 10000);


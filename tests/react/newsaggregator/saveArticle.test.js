import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SaveArticle from './saveArticle';

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


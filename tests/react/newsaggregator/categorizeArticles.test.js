import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CategorizeArticles from './categorizeArticles';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Categorize articles based on predefined categories successfully.', async () => {
  fetchMock.post('/api/categorize-articles', { success: true });

  await act(async () => { render(<MemoryRouter><CategorizeArticles /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Categorize")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Articles categorized successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to categorize articles and display error.', async () => {
  fetchMock.post('/api/categorize-articles', 500);

  await act(async () => { render(<MemoryRouter><CategorizeArticles /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Categorize")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error categorizing articles.")).toBeInTheDocument();
}, 10000);


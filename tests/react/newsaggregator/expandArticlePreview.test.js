import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import HomePage from './expandArticlePreview';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Allows users to expand article previews to full articles successfully', async () => {
  fetchMock.get('/api/articles/1', { status: 200, body: { id: 1, content: 'Full Test Article Content' } });

  await act(async () => { render(<MemoryRouter><HomePage /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Test Article')); });

  expect(fetchMock.calls()).toHaveLength(2);
  expect(screen.getByText('Full Test Article Content')).toBeInTheDocument();
}, 10000);

test('Fails to expand article previews to full articles', async () => {
  fetchMock.get('/api/articles/1', { status: 500 });

  await act(async () => { render(<MemoryRouter><HomePage /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Test Article')); });

  expect(fetchMock.calls()).toHaveLength(2);
  expect(screen.getByText('Failed to load full article')).toBeInTheDocument();
}, 10000);


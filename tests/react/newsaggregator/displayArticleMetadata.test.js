import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import HomePage from './displayArticleMetadata';

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


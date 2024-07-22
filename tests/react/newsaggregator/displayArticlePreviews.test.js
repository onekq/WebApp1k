import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import HomePage from './displayArticlePreviews';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displays article previews on the home page successfully', async () => {
  fetchMock.get('/api/articles', { status: 200, body: [{ id: 1, title: 'Test Article', preview: 'Test Preview' }] });

  await act(async () => { render(<MemoryRouter><HomePage /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Test Article')).toBeInTheDocument();
}, 10000);

test('Fails to display article previews on the home page', async () => {
  fetchMock.get('/api/articles', { status: 500 });

  await act(async () => { render(<MemoryRouter><HomePage /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load articles')).toBeInTheDocument();
}, 10000);


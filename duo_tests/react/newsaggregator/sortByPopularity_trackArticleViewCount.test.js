import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './sortByPopularity_trackArticleViewCount';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Sorts articles by popularity successfully', async () => {
  fetchMock.get('/api/articles?sort=popularity', { status: 200, body: [{ id: 1, popularity: 1000 }] });

  await act(async () => { render(<MemoryRouter><App sortBy="popularity" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('1000')).toBeInTheDocument();
}, 10000);

test('Fails to sort articles by popularity', async () => {
  fetchMock.get('/api/articles?sort=popularity', { status: 500 });

  await act(async () => { render(<MemoryRouter><App sortBy="popularity" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort articles by popularity')).toBeInTheDocument();
}, 10000);

test('Tracks article view count successfully.', async () => {
  fetchMock.post('/api/trackView', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Article')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('View Count Tracked')).toBeInTheDocument();
}, 10000);

test('Fails to track article view count.', async () => {
  fetchMock.post('/api/trackView', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Article')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to track view count')).toBeInTheDocument();
}, 10000);
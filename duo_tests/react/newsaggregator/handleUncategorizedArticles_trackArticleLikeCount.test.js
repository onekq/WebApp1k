import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './handleApp_trackArticleLikeCount';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Handle uncategorized articles successfully.', async () => {
  fetchMock.get('/api/uncategorized-articles', [
    { id: 1, title: "Uncategorized Article 1" }
  ]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Uncategorized Article 1")).toBeInTheDocument();
}, 10000);

test('Fail to handle uncategorized articles and display error.', async () => {
  fetchMock.get('/api/uncategorized-articles', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error fetching uncategorized articles.")).toBeInTheDocument();
}, 10000);

test('Tracks article like count successfully.', async () => {
  fetchMock.post('/api/trackLike', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like Article')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Like Count Tracked')).toBeInTheDocument();
}, 10000);

test('Fails to track article like count.', async () => {
  fetchMock.post('/api/trackLike', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like Article')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to track like count')).toBeInTheDocument();
}, 10000);
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayArticlePreviews_shareArticleViaEmail_sortByPopularity';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Displays article previews on the home page successfully', async () => {
  fetchMock.get('/api/articles', { status: 200, body: [{ id: 1, title: 'Test Article', preview: 'Test Preview' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Test Article')).toBeInTheDocument();
}, 10000);

test('Fails to display article previews on the home page', async () => {
  fetchMock.get('/api/articles', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load articles')).toBeInTheDocument();
}, 10000);

test('shares an article via email successfully', async () => {
  fetchMock.post('/share/email', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Email')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shared via email')).toBeInTheDocument();
}, 10000);

test('fails to share an article via email with error message', async () => {
  fetchMock.post('/share/email', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Email')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to share via email')).toBeInTheDocument();
}, 10000);

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

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './adjustNumberOfArticles_likeArticle_shareArticleViaSocialMedia';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('adjusts the number of articles shown successfully', async () => {
  fetchMock.get('/api/articles?limit=10', { status: 200, body: Array.from({ length: 10 }, (_, i) => ({ id: i, title: `Article ${i}` })) });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('articles-limit-input'), { target: { value: '10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('adjust-articles-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  Array.from({ length: 10 }, (_, i) => `Article ${i}`).forEach(title => expect(screen.getByText(title)).toBeInTheDocument());
}, 10000);

test('fails to adjust the number of articles shown', async () => {
  fetchMock.get('/api/articles?limit=10', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('articles-limit-input'), { target: { value: '10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('adjust-articles-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to adjust the number of articles')).toBeInTheDocument();
}, 10000);

test('likes an article successfully', async () => {
  fetchMock.post('/like', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Liked')).toBeInTheDocument();
}, 10000);

test('fails to like an article with error message', async () => {
  fetchMock.post('/like', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to like')).toBeInTheDocument();
}, 10000);

test('shares an article via social media successfully', async () => {
  fetchMock.post('/share/social-media', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shared on social media')).toBeInTheDocument();
}, 10000);

test('fails to share an article via social media with error message', async () => {
  fetchMock.post('/share/social-media', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to share on social media')).toBeInTheDocument();
}, 10000);

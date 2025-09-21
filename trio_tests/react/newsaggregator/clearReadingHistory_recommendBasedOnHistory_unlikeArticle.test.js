import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './clearReadingHistory_recommendBasedOnHistory_unlikeArticle';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Clears user reading history successfully.', async () => {
  fetchMock.post('/api/clearHistory', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Clear History')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('History Cleared')).toBeInTheDocument();
}, 10000);

test('Fails to clear user reading history.', async () => {
  fetchMock.post('/api/clearHistory', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Clear History')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to clear history')).toBeInTheDocument();
}, 10000);

test('Recommends articles based on user history successfully.', async () => {
  fetchMock.get('/api/recommendations/history', { status: 200, body: { recommendations: ['Article A'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Recommendations Based on History')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Article A')).toBeInTheDocument();
}, 10000);

test('Fails to recommend articles based on user history.', async () => {
  fetchMock.get('/api/recommendations/history', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Recommendations Based on History')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error retrieving recommendations')).toBeInTheDocument();
}, 10000);

test('unlikes an article successfully', async () => {
  fetchMock.post('/unlike', 200);

  await act(async () => { render(<MemoryRouter><UnlikeArticleComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Unlike')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Unliked')).toBeInTheDocument();
}, 10000);

test('fails to unlike an article with error message', async () => {
  fetchMock.post('/unlike', 500);

  await act(async () => { render(<MemoryRouter><UnlikeArticleComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Unlike')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to unlike')).toBeInTheDocument();
}, 10000);

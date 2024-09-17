import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './clearReadingHistory_shareArticleViaSocialMedia';

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
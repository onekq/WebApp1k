import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './clearReadingHistory_retrieveReadingHistory';

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

test('Retrieves user reading history successfully.', async () => {
  fetchMock.get('/api/readingHistory', { status: 200, body: { history: ['Article 1'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View History')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Article 1')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve user reading history.', async () => {
  fetchMock.get('/api/readingHistory', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View History')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error loading history')).toBeInTheDocument();
}, 10000);
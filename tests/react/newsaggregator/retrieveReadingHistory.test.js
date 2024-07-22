import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './retrieveReadingHistory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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


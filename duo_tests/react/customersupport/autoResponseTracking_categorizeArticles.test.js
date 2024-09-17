import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './autoResponseTracking_categorizeArticles';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully tracks the use of auto-responses.', async () => {
  fetchMock.get('/api/getAutoResponseUsage', { usage: '10 times' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('10 times')).toBeInTheDocument();
}, 10000);

test('Fails to track the use of auto-responses.', async () => {
  fetchMock.get('/api/getAutoResponseUsage', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to track usage')).toBeInTheDocument();
}, 10000);

test('successfully categorizes articles by topic', async () => {
  fetchMock.get('path/to/api/articles?category=topic', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('category-select'), { target: { value: 'topic' } });
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('articles-list')).toBeInTheDocument();
}, 10000);

test('fails to categorize articles by topic with error message', async () => {
  fetchMock.get('path/to/api/articles?category=topic', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('category-select'), { target: { value: 'topic' } });
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);
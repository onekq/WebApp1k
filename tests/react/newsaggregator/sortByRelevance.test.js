import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import HomePage from './sortByRelevance';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Sorts articles by relevance successfully', async () => {
  fetchMock.get('/api/articles?sort=relevance', { status: 200, body: [{ id: 1, relevance: 100 }] });

  await act(async () => { render(<MemoryRouter><HomePage sortBy="relevance" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('100')).toBeInTheDocument();
}, 10000);

test('Fails to sort articles by relevance', async () => {
  fetchMock.get('/api/articles?sort=relevance', { status: 500 });

  await act(async () => { render(<MemoryRouter><HomePage sortBy="relevance" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort articles by relevance')).toBeInTheDocument();
}, 10000);


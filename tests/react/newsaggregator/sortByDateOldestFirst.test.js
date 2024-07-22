import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import HomePage from './sortByDateOldestFirst';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Sorts articles by date (oldest first) successfully', async () => {
  fetchMock.get('/api/articles?sort=oldest', { status: 200, body: [{ id: 1, date: '2020-01-01' }] });

  await act(async () => { render(<MemoryRouter><HomePage sortBy="oldest" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('2020-01-01')).toBeInTheDocument();
}, 10000);

test('Fails to sort articles by date (oldest first)', async () => {
  fetchMock.get('/api/articles?sort=oldest', { status: 500 });

  await act(async () => { render(<MemoryRouter><HomePage sortBy="oldest" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort articles by date')).toBeInTheDocument();
}, 10000);


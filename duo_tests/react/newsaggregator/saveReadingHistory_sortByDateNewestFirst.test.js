import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './saveReadingHistory_sortByDateNewestFirst';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Saves user reading history successfully.', async () => {
  fetchMock.post('/api/readingHistory', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('article'), { target: { value: 'New article' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('History Saved')).toBeInTheDocument();
}, 10000);

test('Fails to save user reading history.', async () => {
  fetchMock.post('/api/readingHistory', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('article'), { target: { value: 'New article' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to save history')).toBeInTheDocument();
}, 10000);

test('Sorts articles by date (newest first) successfully', async () => {
  fetchMock.get('/api/articles?sort=newest', { status: 200, body: [{ id: 1, date: '2023-10-01' }] });

  await act(async () => { render(<MemoryRouter><App sortBy="newest" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('2023-10-01')).toBeInTheDocument();
}, 10000);

test('Fails to sort articles by date (newest first)', async () => {
  fetchMock.get('/api/articles?sort=newest', { status: 500 });

  await act(async () => { render(<MemoryRouter><App sortBy="newest" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort articles by date')).toBeInTheDocument();
}, 10000);
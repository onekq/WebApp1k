import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterBySelectedSources_saveReadingHistory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('filters articles by selected sources successfully', async () => {
  fetchMock.get('/api/articles?sources=BBC', { status: 200, body: [{ id: 3, title: 'BBC News' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sources-filter-input'), { target: { value: 'BBC' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-sources-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('BBC News')).toBeInTheDocument();
}, 10000);

test('fails to filter articles by selected sources', async () => {
  fetchMock.get('/api/articles?sources=BBC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sources-filter-input'), { target: { value: 'BBC' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-sources-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter articles')).toBeInTheDocument();
}, 10000);

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
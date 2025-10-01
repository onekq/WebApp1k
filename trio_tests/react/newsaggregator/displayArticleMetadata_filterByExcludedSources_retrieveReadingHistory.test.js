import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayArticleMetadata_filterByExcludedSources_retrieveReadingHistory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Displays article metadata successfully', async () => {
  fetchMock.get('/api/articles', { status: 200, body: [{ id: 1, author: 'Author', date: 'Date', source: 'Source' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Author')).toBeInTheDocument();
  expect(screen.getByText('Date')).toBeInTheDocument();
  expect(screen.getByText('Source')).toBeInTheDocument();
}, 10000);

test('Fails to display article metadata', async () => {
  fetchMock.get('/api/articles', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load article metadata')).toBeInTheDocument();
}, 10000);

test('filters articles by excluded sources successfully', async () => {
  fetchMock.get('/api/articles?excludedSources=CNN', { status: 200, body: [{ id: 4, title: 'Non-CNN News' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-sources-filter-input'), { target: { value: 'CNN' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-excluded-sources-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Non-CNN News')).toBeInTheDocument();
}, 10000);

test('fails to filter articles by excluded sources', async () => {
  fetchMock.get('/api/articles?excludedSources=CNN', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('excluded-sources-filter-input'), { target: { value: 'CNN' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-excluded-sources-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter articles')).toBeInTheDocument();
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

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterBySelectedSources_flagInappropriateArticle';

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

test('Flag inappropriate article successfully.', async () => {
  fetchMock.post('/api/flag-article', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Flag Article")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Article flagged successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to flag inappropriate article and display error.', async () => {
  fetchMock.post('/api/flag-article', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Flag Article")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error flagging article.")).toBeInTheDocument();
}, 10000);
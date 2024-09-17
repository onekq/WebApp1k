import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteComment_filterBySelectedCategories';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('deletes a comment successfully', async () => {
  fetchMock.delete('/comment/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Comment deleted')).toBeInTheDocument();
}, 10000);

test('fails to delete a comment with error message', async () => {
  fetchMock.delete('/comment/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to delete comment')).toBeInTheDocument();
}, 10000);

test('filters articles by selected categories successfully', async () => {
  fetchMock.get('/api/articles?categories=Tech', { status: 200, body: [{ id: 1, title: 'Tech News' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('categories-filter-input'), { target: { value: 'Tech' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-categories-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Tech News')).toBeInTheDocument();
}, 10000);

test('fails to filter articles by selected categories', async () => {
  fetchMock.get('/api/articles?categories=Tech', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('categories-filter-input'), { target: { value: 'Tech' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-categories-filter-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter articles')).toBeInTheDocument();
}, 10000);
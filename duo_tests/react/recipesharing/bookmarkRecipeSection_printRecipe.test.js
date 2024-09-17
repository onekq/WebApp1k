import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './bookmarkRecipeSection_printRecipe';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Bookmark Recipe Section successfully', async () => {
  fetchMock.post('/api/recipe/1/bookmark', { body: { message: 'Section bookmarked' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Bookmark Section')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Section bookmarked')).toBeInTheDocument();
}, 10000);

test('Bookmark Recipe Section failure shows error message', async () => {
  fetchMock.post('/api/recipe/1/bookmark', { body: { message: 'Error bookmarking section' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Bookmark Section')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error bookmarking section')).toBeInTheDocument();
}, 10000);

test('Print Recipe successfully', async () => {
  fetchMock.get('/api/recipe/1', { body: { title: 'Printable Recipe' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Print Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Printable Recipe')).toBeInTheDocument();
}, 10000);

test('Print Recipe failure shows error message', async () => {
  fetchMock.get('/api/recipe/1', { body: { message: 'Error printing recipe' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Print Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error printing recipe')).toBeInTheDocument();
}, 10000);
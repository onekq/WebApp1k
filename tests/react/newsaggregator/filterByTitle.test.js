import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import HomePage from './filterByTitle';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Searches articles by title successfully', async () => {
  fetchMock.get('/api/articles?title=test', { status: 200, body: [{ id: 1, title: 'Test Title' }] });

  await act(async () => { render(<MemoryRouter><HomePage /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'test' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Test Title')).toBeInTheDocument();
}, 10000);

test('Fails to search articles by title', async () => {
  fetchMock.get('/api/articles?title=test', { status: 500 });

  await act(async () => { render(<MemoryRouter><HomePage /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'test' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No articles found for test')).toBeInTheDocument();
}, 10000);

fetchMock.restore();
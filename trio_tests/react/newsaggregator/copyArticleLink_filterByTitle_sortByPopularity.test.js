import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './copyArticleLink_filterByTitle_sortByPopularity';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('copies article link to clipboard successfully', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Copy Link')); });

  expect(navigator.clipboard.writeText).toBeCalledWith('http://example.com/article');
  expect(screen.getByText('Link copied')).toBeInTheDocument();
}, 10000);

test('fails to copy article link to clipboard with error message', async () => {
  navigator.clipboard.writeText = jest.fn().mockImplementation(() => { throw new Error('Copy failed'); });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Copy Link')); });

  expect(navigator.clipboard.writeText).toBeCalledWith('http://example.com/article');
  expect(screen.getByText('Failed to copy link')).toBeInTheDocument();
}, 10000);

test('Searches articles by title successfully', async () => {
  fetchMock.get('/api/articles?title=test', { status: 200, body: [{ id: 1, title: 'Test Title' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'test' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Test Title')).toBeInTheDocument();
}, 10000);

test('Fails to search articles by title', async () => {
  fetchMock.get('/api/articles?title=test', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'test' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No articles found for test')).toBeInTheDocument();
}, 10000);

test('Sorts articles by popularity successfully', async () => {
  fetchMock.get('/api/articles?sort=popularity', { status: 200, body: [{ id: 1, popularity: 1000 }] });

  await act(async () => { render(<MemoryRouter><App sortBy="popularity" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('1000')).toBeInTheDocument();
}, 10000);

test('Fails to sort articles by popularity', async () => {
  fetchMock.get('/api/articles?sort=popularity', { status: 500 });

  await act(async () => { render(<MemoryRouter><App sortBy="popularity" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort articles by popularity')).toBeInTheDocument();
}, 10000);

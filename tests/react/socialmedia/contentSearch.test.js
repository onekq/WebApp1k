import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SearchComponent from './contentSearch';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully searches and displays posts.', async () => {
  fetchMock.post('/api/search', {
    status: 200, body: [{ id: 1, content: 'Search result' }]
  });

  await act(async () => {
    render(<MemoryRouter><SearchComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'test' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Search'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Search result')).toBeInTheDocument();
}, 10000);

test('Shows error message for invalid search query.', async () => {
  fetchMock.post('/api/search', {
    status: 400, body: { message: 'Invalid search query' }
  });

  await act(async () => {
    render(<MemoryRouter><SearchComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Search'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid search query')).toBeInTheDocument();
}, 10000);


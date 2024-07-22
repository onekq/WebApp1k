import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './searchArticles';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully searches for articles in the knowledge base', async () => {
  fetchMock.get('path/to/api/articles?search=term', 200);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'term' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('search-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('articles-list')).toBeInTheDocument();
}, 10000);

test('fails to search for articles in the knowledge base with error message', async () => {
  fetchMock.get('path/to/api/articles?search=term', 500);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'term' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('search-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);


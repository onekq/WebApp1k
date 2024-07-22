import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './suggestArticles';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully suggests articles based on ticket content', async () => {
  fetchMock.post('path/to/api/article/suggest', 200);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('suggest-articles-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('suggested-articles-list')).toBeInTheDocument();
}, 10000);

test('fails to suggest articles based on ticket content with error message', async () => {
  fetchMock.post('path/to/api/article/suggest', 500);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('suggest-articles-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);


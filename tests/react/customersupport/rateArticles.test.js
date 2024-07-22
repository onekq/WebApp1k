import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './rateArticles';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully rates articles for helpfulness', async () => {
  fetchMock.post('path/to/api/article/rate', 200);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('rate-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('thank-you-message')).toBeInTheDocument();
}, 10000);

test('fails to rate articles for helpfulness with error message', async () => {
  fetchMock.post('path/to/api/article/rate', 500);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('rate-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);


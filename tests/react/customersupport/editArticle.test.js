import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './editArticle';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully edits existing articles', async () => {
  fetchMock.put('path/to/api/article', 200);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('article-input'), { target: { value: 'Updated Article' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('edit-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('fails to edit existing articles with error message', async () => {
  fetchMock.put('path/to/api/article', 500);

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('article-input'), { target: { value: 'Updated Article' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('edit-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);


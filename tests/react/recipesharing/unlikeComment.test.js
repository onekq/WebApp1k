import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './unlikeComment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully unlike a comment on a recipe', async () => {
  fetchMock.post('/api/unlike-comment', { status: 200 });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unlike-comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('unlike-comment-message')).toBeInTheDocument();
}, 10000);

test('Fail to unlike a comment with error message', async () => {
  fetchMock.post('/api/unlike-comment', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unlike-comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);


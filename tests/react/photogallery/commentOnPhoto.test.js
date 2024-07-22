import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './commentOnPhoto';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should successfully add a comment on a photo.', async () => {
  fetchMock.post('/api/photo/comment', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Nice photo!' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('comment-submit'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('comment-Nice photo!')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to add a comment.', async () => {
  fetchMock.post('/api/photo/comment', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Nice photo!' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('comment-submit'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to add comment')).toBeInTheDocument();
}, 10000);


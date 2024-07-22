import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import DeleteCommentComponent from './deleteComment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('deletes a comment successfully', async () => {
  fetchMock.delete('/comment/1', 200);

  await act(async () => { render(<MemoryRouter><DeleteCommentComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Comment deleted')).toBeInTheDocument();
}, 10000);

test('fails to delete a comment with error message', async () => {
  fetchMock.delete('/comment/1', 500);

  await act(async () => { render(<MemoryRouter><DeleteCommentComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to delete comment')).toBeInTheDocument();
}, 10000);


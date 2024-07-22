import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './deleteBlogPost';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: delete a blog post', async () => {
  fetchMock.delete('/api/deletePost', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post deleted successfully')).toBeInTheDocument();
}, 10000);

test('Failure: delete a blog post without authorization', async () => {
  fetchMock.delete('/api/deletePost', { status: 403, body: { error: 'Unauthorized' } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Unauthorized')).toBeInTheDocument();
}, 10000);


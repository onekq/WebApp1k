import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './editBlogPost';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: edit an existing blog post', async () => {
  fetchMock.put('/api/editPost', { status: 200, body: { id: 1, title: 'Updated Post', content: 'Updated content' } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Updated Post' } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'Updated content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/update/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post updated successfully')).toBeInTheDocument();
}, 10000);

test('Failure: edit an existing blog post without authorization', async () => {
  fetchMock.put('/api/editPost', { status: 403, body: { error: 'Unauthorized' } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Updated Post' } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'Updated content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/update/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Unauthorized')).toBeInTheDocument();
}, 10000);

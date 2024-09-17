import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './postCreation_postEditing';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Verify post creation with valid content.', async () => {
  fetchMock.post('/api/posts', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Write a post...'), { target: { value: 'Hello World!' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Post'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post created successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure error handling for invalid post content.', async () => {
  fetchMock.post('/api/posts', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Write a post...'), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Post'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post content cannot be empty.')).toBeInTheDocument();
}, 10000);

test('Test updating an existing post.', async () => {
  fetchMock.put('/api/posts/1', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByText('Edit'), { target: { value: 'New content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post updated successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure changes are saved and displayed.', async () => {
  fetchMock.put('/api/posts/1', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByText('Edit'), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update the post.')).toBeInTheDocument();
}, 10000);
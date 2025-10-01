import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addComment_deleteComment_editTag';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully adds a comment to a post', async () => {
  fetchMock.post('/api/comments', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText(/Add a comment/i), { target: { value: 'Great post!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Submit/i)); });

  expect(fetchMock.calls('/api/comments').length).toBe(1);
  expect(screen.getByText(/Comment added successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add a comment to a post', async () => {
  fetchMock.post('/api/comments', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText(/Add a comment/i), { target: { value: 'Great post!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Submit/i)); });

  expect(fetchMock.calls('/api/comments').length).toBe(1);
  expect(screen.getByText(/Failed to add comment/i)).toBeInTheDocument();
}, 10000);

test('successfully deletes a comment', async () => {
  fetchMock.delete('/api/comments/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete/i)); });

  expect(fetchMock.calls('/api/comments/1').length).toBe(1);
  expect(screen.getByText(/Comment deleted successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to delete a comment', async () => {
  fetchMock.delete('/api/comments/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete/i)); });

  expect(fetchMock.calls('/api/comments/1').length).toBe(1);
  expect(screen.getByText(/Failed to delete comment/i)).toBeInTheDocument();
}, 10000);

test('User can edit an existing tag successfully', async () => {
  fetchMock.put('/tags/1', {
    status: 200,
    body: { id: 1, name: 'Updated Tag' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tag Name'), { target: { value: 'Updated Tag' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Tag')); });

  expect(fetchMock.calls('/tags/1').length).toBe(1);
  expect(screen.getByText('Tag updated successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when editing a tag fails', async () => {
  fetchMock.put('/tags/1', {
    status: 500,
    body: { error: 'Unable to update tag' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tag Name'), { target: { value: 'Updated Tag' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Tag')); });

  expect(fetchMock.calls('/tags/1').length).toBe(1);
  expect(screen.getByText('Error: Unable to update tag')).toBeInTheDocument();
}, 10000);

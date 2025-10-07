import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addMetaKeywords_deleteCategory_addMetaTitle_assignTagsToPost';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully generates and adds meta keywords to a post (from addMetaKeywords_deleteCategory)', async () => {
  fetchMock.post('/api/meta-keywords', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate meta keywords/i)); });

  expect(fetchMock.calls('/api/meta-keywords').length).toBe(1);
  expect(screen.getByText(/meta keywords generated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to generate and add meta keywords to a post due to server error (from addMetaKeywords_deleteCategory)', async () => {
  fetchMock.post('/api/meta-keywords', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate meta keywords/i)); });

  expect(fetchMock.calls('/api/meta-keywords').length).toBe(1);
  expect(screen.getByText(/failed to generate meta keywords/i)).toBeInTheDocument();
}, 10000);

test('User can delete a category successfully (from addMetaKeywords_deleteCategory)', async () => {
  fetchMock.delete('/categories/1', {
    status: 204
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Category')); });

  expect(fetchMock.calls('/categories/1').length).toBe(1);
  expect(screen.getByText('Category deleted successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when deleting a category fails (from addMetaKeywords_deleteCategory)', async () => {
  fetchMock.delete('/categories/1', {
    status: 500,
    body: { error: 'Unable to delete category' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Category')); });

  expect(fetchMock.calls('/categories/1').length).toBe(1);
  expect(screen.getByText('Error: Unable to delete category')).toBeInTheDocument();
}, 10000);

test('successfully adds a meta title to a post (from addMetaTitle_assignTagsToPost)', async () => {
  fetchMock.post('/api/meta-title', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/meta title/i), { target: { value: 'New Meta Title' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/meta-title').length).toBe(1);
  expect(screen.getByText(/meta title updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add a meta title to a post due to server error (from addMetaTitle_assignTagsToPost)', async () => {
  fetchMock.post('/api/meta-title', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/meta title/i), { target: { value: 'New Meta Title' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/meta-title').length).toBe(1);
  expect(screen.getByText(/failed to update meta title/i)).toBeInTheDocument();
}, 10000);

test('User can assign tags to a post successfully (from addMetaTitle_assignTagsToPost)', async () => {
  fetchMock.post('/posts/1/tags', {
    status: 200,
    body: { postId: 1, tags: [1, 2] }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tags Select'), { target: { value: ['1', '2'] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign Tags')); });

  expect(fetchMock.calls('/posts/1/tags').length).toBe(1);
  expect(screen.getByText('Tags assigned to post successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when assigning tags to a post fails (from addMetaTitle_assignTagsToPost)', async () => {
  fetchMock.post('/posts/1/tags', {
    status: 500,
    body: { error: 'Unable to assign tags' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tags Select'), { target: { value: ['1', '2'] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign Tags')); });

  expect(fetchMock.calls('/posts/1/tags').length).toBe(1);
  expect(screen.getByText('Error: Unable to assign tags')).toBeInTheDocument();
}, 10000);


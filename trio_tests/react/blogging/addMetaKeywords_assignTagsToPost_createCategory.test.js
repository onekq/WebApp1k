import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addMetaKeywords_assignTagsToPost_createCategory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully generates and adds meta keywords to a post', async () => {
  fetchMock.post('/api/meta-keywords', { status: 200 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate meta keywords/i)); });

  expect(fetchMock.calls('/api/meta-keywords').length).toBe(1);
  expect(screen.getByText(/meta keywords generated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to generate and add meta keywords to a post due to server error', async () => {
  fetchMock.post('/api/meta-keywords', { status: 500 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate meta keywords/i)); });

  expect(fetchMock.calls('/api/meta-keywords').length).toBe(1);
  expect(screen.getByText(/failed to generate meta keywords/i)).toBeInTheDocument();
}, 10000);

test('User can assign tags to a post successfully', async () => {
  fetchMock.post('/posts/1/tags', {
    status: 200,
    body: { postId: 1, tags: [1, 2] }
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tags Select'), { target: { value: ['1', '2'] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign Tags')); });

  expect(fetchMock.calls('/posts/1/tags').length).toBe(1);
  expect(screen.getByText('Tags assigned to post successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when assigning tags to a post fails', async () => {
  fetchMock.post('/posts/1/tags', {
    status: 500,
    body: { error: 'Unable to assign tags' }
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tags Select'), { target: { value: ['1', '2'] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign Tags')); });

  expect(fetchMock.calls('/posts/1/tags').length).toBe(1);
  expect(screen.getByText('Error: Unable to assign tags')).toBeInTheDocument();
}, 10000);

test('User can create a new category successfully', async () => {
  fetchMock.post('/categories', {
    status: 201,
    body: { id: 1, name: 'New Category' }
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Category Name'), { target: { value: 'New Category' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Category')); });

  expect(fetchMock.calls('/categories').length).toBe(1);
  expect(screen.getByText('Category created successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when creating a new category fails', async () => {
  fetchMock.post('/categories', {
    status: 500,
    body: { error: 'Unable to create category' }
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Category Name'), { target: { value: 'New Category' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Category')); });

  expect(fetchMock.calls('/categories').length).toBe(1);
  expect(screen.getByText('Error: Unable to create category')).toBeInTheDocument();
}, 10000);

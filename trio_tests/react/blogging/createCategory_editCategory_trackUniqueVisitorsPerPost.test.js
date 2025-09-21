import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './createCategory_editCategory_trackUniqueVisitorsPerPost';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('User can edit an existing category successfully', async () => {
  fetchMock.put('/categories/1', {
    status: 200,
    body: { id: 1, name: 'Updated Category' }
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Category Name'), { target: { value: 'Updated Category' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Category')); });

  expect(fetchMock.calls('/categories/1').length).toBe(1);
  expect(screen.getByText('Category updated successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when editing a category fails', async () => {
  fetchMock.put('/categories/1', {
    status: 500,
    body: { error: 'Unable to update category' }
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Category Name'), { target: { value: 'Updated Category' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Category')); });

  expect(fetchMock.calls('/categories/1').length).toBe(1);
  expect(screen.getByText('Error: Unable to update category')).toBeInTheDocument();
}, 10000);

test('successfully tracks unique visitors per post', async () => {
  fetchMock.post('/api/trackUniqueVisitors', { status: 200 });

  await act(async () => { render(<MemoryRouter><TrackUniqueVisitors postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Visit Post')); });

  expect(fetchMock.calls('/api/trackUniqueVisitors')).toHaveLength(1);
  expect(fetchMock.calls('/api/trackUniqueVisitors')[0][1].body).toContain('"postId":"1"');
  expect(screen.getByText('Unique Visitors: 1')).toBeInTheDocument();
}, 10000);

test('fails to track unique visitors with an error message', async () => {
  fetchMock.post('/api/trackUniqueVisitors', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><TrackUniqueVisitors postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Visit Post')); });

  expect(fetchMock.calls('/api/trackUniqueVisitors')).toHaveLength(1);
  expect(screen.getByText('Error tracking visitors')).toBeInTheDocument();
}, 10000);

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './createCategory_editTag';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can create a new category successfully', async () => {
  fetchMock.post('/categories', {
    status: 201,
    body: { id: 1, name: 'New Category' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
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

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Category Name'), { target: { value: 'New Category' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Category')); });

  expect(fetchMock.calls('/categories').length).toBe(1);
  expect(screen.getByText('Error: Unable to create category')).toBeInTheDocument();
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
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './createTag_deleteTag';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can create a new tag successfully', async () => {
  fetchMock.post('/tags', {
    status: 201,
    body: { id: 1, name: 'New Tag' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tag Name'), { target: { value: 'New Tag' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Tag')); });

  expect(fetchMock.calls('/tags').length).toBe(1);
  expect(screen.getByText('Tag created successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when creating a new tag fails', async () => {
  fetchMock.post('/tags', {
    status: 500,
    body: { error: 'Unable to create tag' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tag Name'), { target: { value: 'New Tag' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Tag')); });

  expect(fetchMock.calls('/tags').length).toBe(1);
  expect(screen.getByText('Error: Unable to create tag')).toBeInTheDocument();
}, 10000);

test('User can delete a tag successfully', async () => {
  fetchMock.delete('/tags/1', {
    status: 204
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Tag')); });

  expect(fetchMock.calls('/tags/1').length).toBe(1);
  expect(screen.getByText('Tag deleted successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when deleting a tag fails', async () => {
  fetchMock.delete('/tags/1', {
    status: 500,
    body: { error: 'Unable to delete tag' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Tag')); });

  expect(fetchMock.calls('/tags/1').length).toBe(1);
  expect(screen.getByText('Error: Unable to delete tag')).toBeInTheDocument();
}, 10000);
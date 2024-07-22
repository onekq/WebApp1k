import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './deleteTag';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can delete a tag successfully', async () => {
  fetchMock.delete('/tags/1', {
    status: 204
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Tag')); });

  expect(fetchMock.calls('/tags/1').length).toBe(1);
  expect(screen.getByText('Tag deleted successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when deleting a tag fails', async () => {
  fetchMock.delete('/tags/1', {
    status: 500,
    body: { error: 'Unable to delete tag' }
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Tag')); });

  expect(fetchMock.calls('/tags/1').length).toBe(1);
  expect(screen.getByText('Error: Unable to delete tag')).toBeInTheDocument();
}, 10000);


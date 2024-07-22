import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './deleteCategory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can delete a category successfully', async () => {
  fetchMock.delete('/categories/1', {
    status: 204
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Category')); });

  expect(fetchMock.calls('/categories/1').length).toBe(1);
  expect(screen.getByText('Category deleted successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when deleting a category fails', async () => {
  fetchMock.delete('/categories/1', {
    status: 500,
    body: { error: 'Unable to delete category' }
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Category')); });

  expect(fetchMock.calls('/categories/1').length).toBe(1);
  expect(screen.getByText('Error: Unable to delete category')).toBeInTheDocument();
}, 10000);


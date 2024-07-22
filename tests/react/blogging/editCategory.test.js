import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './editCategory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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


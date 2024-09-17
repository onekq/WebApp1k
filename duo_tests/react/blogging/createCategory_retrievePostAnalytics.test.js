import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './createCategory_retrievePostAnalytics';

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

test('successfully retrieves analytics for a post', async () => {
  fetchMock.get('/api/getPostAnalytics?postId=1', { status: 200, body: { views: 10, shares: 5 } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Get Analytics')); });

  expect(fetchMock.calls('/api/getPostAnalytics')).toHaveLength(1);
  expect(screen.getByText('Views: 10')).toBeInTheDocument();
  expect(screen.getByText('Shares: 5')).toBeInTheDocument();
}, 10000);

test('fails to retrieve analytics for a post with an error message', async () => {
  fetchMock.get('/api/getPostAnalytics?postId=1', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Get Analytics')); });

  expect(fetchMock.calls('/api/getPostAnalytics')).toHaveLength(1);
  expect(screen.getByText('Error retrieving analytics')).toBeInTheDocument();
}, 10000);
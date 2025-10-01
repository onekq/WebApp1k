import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editCategory_retrievePostAnalytics_trackPostViews';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('User can edit an existing category successfully', async () => {
  fetchMock.put('/categories/1', {
    status: 200,
    body: { id: 1, name: 'Updated Category' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
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

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Category Name'), { target: { value: 'Updated Category' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Category')); });

  expect(fetchMock.calls('/categories/1').length).toBe(1);
  expect(screen.getByText('Error: Unable to update category')).toBeInTheDocument();
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

test('successfully tracks post views', async () => {
  fetchMock.post('/api/trackPostViews', { status: 200 });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Post')); });

  expect(fetchMock.calls('/api/trackPostViews')).toHaveLength(1);
  expect(fetchMock.calls('/api/trackPostViews')[0][1].body).toContain('"postId":"1"');
  expect(screen.getByText('Views: 1')).toBeInTheDocument();
}, 10000);

test('fails to track post views with an error message', async () => {
  fetchMock.post('/api/trackPostViews', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Post')); });

  expect(fetchMock.calls('/api/trackPostViews')).toHaveLength(1);
  expect(screen.getByText('Error tracking views')).toBeInTheDocument();
}, 10000);

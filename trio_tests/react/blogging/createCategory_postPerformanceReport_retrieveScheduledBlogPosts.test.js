import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './createCategory_postPerformanceReport_retrieveScheduledBlogPosts';

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

test('successfully generates post performance report', async () => {
  fetchMock.get('/api/generatePostPerformanceReport?postId=1', { status: 200, body: { performance: 'high' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Report')); });

  expect(fetchMock.calls('/api/generatePostPerformanceReport')).toHaveLength(1);
  expect(screen.getByText('Performance: high')).toBeInTheDocument();
}, 10000);

test('fails to generate post performance report with an error message', async () => {
  fetchMock.get('/api/generatePostPerformanceReport?postId=1', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Report')); });

  expect(fetchMock.calls('/api/generatePostPerformanceReport')).toHaveLength(1);
  expect(screen.getByText('Error generating report')).toBeInTheDocument();
}, 10000);

test('Success: retrieve a list of scheduled blog posts', async () => {
  fetchMock.get('/api/posts?status=scheduled', { status: 200, body: [{ id: 1, title: 'Scheduled Post' }] });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Scheduled Post')).toBeInTheDocument();
}, 10000);

test('Failure: fetch scheduled posts but none exist', async () => {
  fetchMock.get('/api/posts?status=scheduled', { status: 404, body: { error: 'No scheduled posts found' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No scheduled posts found')).toBeInTheDocument();
}, 10000);

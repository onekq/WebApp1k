import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './postPerformanceReport_retrievePostAnalytics_retrievePublishedBlogPosts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully generates post performance report', async () => {
  fetchMock.get('/api/generatePostPerformanceReport?postId=1', { status: 200, body: { performance: 'high' } });

  await act(async () => { render(<MemoryRouter><GeneratePostPerformanceReport postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Report')); });

  expect(fetchMock.calls('/api/generatePostPerformanceReport')).toHaveLength(1);
  expect(screen.getByText('Performance: high')).toBeInTheDocument();
}, 10000);

test('fails to generate post performance report with an error message', async () => {
  fetchMock.get('/api/generatePostPerformanceReport?postId=1', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><GeneratePostPerformanceReport postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Report')); });

  expect(fetchMock.calls('/api/generatePostPerformanceReport')).toHaveLength(1);
  expect(screen.getByText('Error generating report')).toBeInTheDocument();
}, 10000);

test('successfully retrieves analytics for a post', async () => {
  fetchMock.get('/api/getPostAnalytics?postId=1', { status: 200, body: { views: 10, shares: 5 } });

  await act(async () => { render(<MemoryRouter><RetrievePostAnalytics postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Get Analytics')); });

  expect(fetchMock.calls('/api/getPostAnalytics')).toHaveLength(1);
  expect(screen.getByText('Views: 10')).toBeInTheDocument();
  expect(screen.getByText('Shares: 5')).toBeInTheDocument();
}, 10000);

test('fails to retrieve analytics for a post with an error message', async () => {
  fetchMock.get('/api/getPostAnalytics?postId=1', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><RetrievePostAnalytics postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Get Analytics')); });

  expect(fetchMock.calls('/api/getPostAnalytics')).toHaveLength(1);
  expect(screen.getByText('Error retrieving analytics')).toBeInTheDocument();
}, 10000);

test('Success: retrieve a list of published blog posts', async () => {
  fetchMock.get('/api/posts?status=published', { status: 200, body: [{ id: 1, title: 'Published Post' }] });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Published Post')).toBeInTheDocument();
}, 10000);

test('Failure: fetch published posts but none exist', async () => {
  fetchMock.get('/api/posts?status=published', { status: 404, body: { error: 'No published posts found' } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No published posts found')).toBeInTheDocument();
}, 10000);

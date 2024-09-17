import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteBlogPost_trackBounceRate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: delete a blog post', async () => {
  fetchMock.delete('/api/deletePost', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post deleted successfully')).toBeInTheDocument();
}, 10000);

test('Failure: delete a blog post without authorization', async () => {
  fetchMock.delete('/api/deletePost', { status: 403, body: { error: 'Unauthorized' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Unauthorized')).toBeInTheDocument();
}, 10000);

test('successfully tracks bounce rate', async () => {
  fetchMock.post('/api/trackBounceRate', { status: 200 });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Track Bounce Rate')); });

  expect(fetchMock.calls('/api/trackBounceRate')).toHaveLength(1);
  expect(screen.getByText('Bounce Rate: 50%')).toBeInTheDocument();
}, 10000);

test('fails to track bounce rate with an error message', async () => {
  fetchMock.post('/api/trackBounceRate', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Track Bounce Rate')); });

  expect(fetchMock.calls('/api/trackBounceRate')).toHaveLength(1);
  expect(screen.getByText('Error tracking bounce rate')).toBeInTheDocument();
}, 10000);
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addCanonicalUrl_retrievePostsByCategory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds a canonical URL to a post', async () => {
  fetchMock.post('/api/canonical-url', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/canonical url/i), { target: { value: 'http://example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/canonical-url').length).toBe(1);
  expect(screen.getByText(/canonical url updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add a canonical URL to a post due to server error', async () => {
  fetchMock.post('/api/canonical-url', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/canonical url/i), { target: { value: 'http://example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/canonical-url').length).toBe(1);
  expect(screen.getByText(/failed to update canonical url/i)).toBeInTheDocument();
}, 10000);

test('User can retrieve posts by category successfully', async () => {
  fetchMock.get('/categories/1/posts', {
    status: 200,
    body: [{ id: 1, title: 'First Post' }, { id: 2, title: 'Second Post' }]
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Category Select'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Posts')); });

  expect(fetchMock.calls('/categories/1/posts').length).toBe(1);
  expect(screen.getByText('First Post')).toBeInTheDocument();
  expect(screen.getByText('Second Post')).toBeInTheDocument();
}, 10000);

test('User gets an error message when retrieving posts by category fails', async () => {
  fetchMock.get('/categories/1/posts', {
    status: 500,
    body: { error: 'Unable to fetch posts' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Category Select'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Posts')); });

  expect(fetchMock.calls('/categories/1/posts').length).toBe(1);
  expect(screen.getByText('Error: Unable to fetch posts')).toBeInTheDocument();
}, 10000);
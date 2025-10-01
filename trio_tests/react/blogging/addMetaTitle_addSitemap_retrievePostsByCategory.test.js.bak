import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addMetaTitle_addSitemap_retrievePostsByCategory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully adds a meta title to a post', async () => {
  fetchMock.post('/api/meta-title', { status: 200 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/meta title/i), { target: { value: 'New Meta Title' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/meta-title').length).toBe(1);
  expect(screen.getByText(/meta title updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add a meta title to a post due to server error', async () => {
  fetchMock.post('/api/meta-title', { status: 500 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/meta title/i), { target: { value: 'New Meta Title' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/meta-title').length).toBe(1);
  expect(screen.getByText(/failed to update meta title/i)).toBeInTheDocument();
}, 10000);

test('successfully generates an XML sitemap', async () => {
  fetchMock.post('/api/xml-sitemap', { status: 200 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate xml sitemap/i)); });

  expect(fetchMock.calls('/api/xml-sitemap').length).toBe(1);
  expect(screen.getByText(/xml sitemap generated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to generate an XML sitemap due to server error', async () => {
  fetchMock.post('/api/xml-sitemap', { status: 500 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate xml sitemap/i)); });

  expect(fetchMock.calls('/api/xml-sitemap').length).toBe(1);
  expect(screen.getByText(/failed to generate xml sitemap/i)).toBeInTheDocument();
}, 10000);

test('User can retrieve posts by category successfully', async () => {
  fetchMock.get('/categories/1/posts', {
    status: 200,
    body: [{ id: 1, title: 'First Post' }, { id: 2, title: 'Second Post' }]
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
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

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Category Select'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Posts')); });

  expect(fetchMock.calls('/categories/1/posts').length).toBe(1);
  expect(screen.getByText('Error: Unable to fetch posts')).toBeInTheDocument();
}, 10000);

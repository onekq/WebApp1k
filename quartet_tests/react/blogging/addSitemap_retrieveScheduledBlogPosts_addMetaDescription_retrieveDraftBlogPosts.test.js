import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addSitemap_retrieveScheduledBlogPosts_addMetaDescription_retrieveDraftBlogPosts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully generates an XML sitemap (from addSitemap_retrieveScheduledBlogPosts)', async () => {
  fetchMock.post('/api/xml-sitemap', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate xml sitemap/i)); });

  expect(fetchMock.calls('/api/xml-sitemap').length).toBe(1);
  expect(screen.getByText(/xml sitemap generated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to generate an XML sitemap due to server error (from addSitemap_retrieveScheduledBlogPosts)', async () => {
  fetchMock.post('/api/xml-sitemap', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate xml sitemap/i)); });

  expect(fetchMock.calls('/api/xml-sitemap').length).toBe(1);
  expect(screen.getByText(/failed to generate xml sitemap/i)).toBeInTheDocument();
}, 10000);

test('Success: retrieve a list of scheduled blog posts (from addSitemap_retrieveScheduledBlogPosts)', async () => {
  fetchMock.get('/api/posts?status=scheduled', { status: 200, body: [{ id: 1, title: 'Scheduled Post' }] });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Scheduled Post')).toBeInTheDocument();
}, 10000);

test('Failure: fetch scheduled posts but none exist (from addSitemap_retrieveScheduledBlogPosts)', async () => {
  fetchMock.get('/api/posts?status=scheduled', { status: 404, body: { error: 'No scheduled posts found' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No scheduled posts found')).toBeInTheDocument();
}, 10000);

test('successfully adds a meta description to a post (from addMetaDescription_retrieveDraftBlogPosts)', async () => {
  fetchMock.post('/api/meta-description', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/meta description/i), { target: { value: 'New Meta Description' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/meta-description').length).toBe(1);
  expect(screen.getByText(/meta description updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add a meta description to a post due to server error (from addMetaDescription_retrieveDraftBlogPosts)', async () => {
  fetchMock.post('/api/meta-description', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/meta description/i), { target: { value: 'New Meta Description' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/meta-description').length).toBe(1);
  expect(screen.getByText(/failed to update meta description/i)).toBeInTheDocument();
}, 10000);

test('Success: retrieve a list of draft blog posts (from addMetaDescription_retrieveDraftBlogPosts)', async () => {
  fetchMock.get('/api/posts?status=draft', { status: 200, body: [{ id: 1, title: 'Draft Post' }] });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft Post')).toBeInTheDocument();
}, 10000);

test('Failure: fetch draft posts but none exist (from addMetaDescription_retrieveDraftBlogPosts)', async () => {
  fetchMock.get('/api/posts?status=draft', { status: 404, body: { error: 'No draft posts found' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No draft posts found')).toBeInTheDocument();
}, 10000);


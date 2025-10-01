import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './retrieveAllBlogPosts_retrieveDraftBlogPosts_seoAuditReport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Success: retrieve a list of all blog posts', async () => {
  fetchMock.get('/api/posts', { status: 200, body: [{ id: 1, title: 'First Post' }, { id: 2, title: 'Second Post' }] });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('First Post')).toBeInTheDocument();
  expect(screen.getByText('Second Post')).toBeInTheDocument();
}, 10000);

test('Failure: retrieve a list of blog posts with server error', async () => {
  fetchMock.get('/api/posts', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Internal Server Error')).toBeInTheDocument();
}, 10000);

test('Success: retrieve a list of draft blog posts', async () => {
  fetchMock.get('/api/posts?status=draft', { status: 200, body: [{ id: 1, title: 'Draft Post' }] });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft Post')).toBeInTheDocument();
}, 10000);

test('Failure: fetch draft posts but none exist', async () => {
  fetchMock.get('/api/posts?status=draft', { status: 404, body: { error: 'No draft posts found' } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No draft posts found')).toBeInTheDocument();
}, 10000);

test('successfully generates an SEO audit report', async () => {
  fetchMock.post('/api/seo-audit', { status: 200 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate seo audit report/i)); });

  expect(fetchMock.calls('/api/seo-audit').length).toBe(1);
  expect(screen.getByText(/seo audit report generated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to generate an SEO audit report due to server error', async () => {
  fetchMock.post('/api/seo-audit', { status: 500 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate seo audit report/i)); });

  expect(fetchMock.calls('/api/seo-audit').length).toBe(1);
  expect(screen.getByText(/failed to generate seo audit report/i)).toBeInTheDocument();
}, 10000);

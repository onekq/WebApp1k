import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addSitemap_analyzeCommentSentiment_addMetaDescription_retrieveDraftBlogPosts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully generates an XML sitemap (from addSitemap_analyzeCommentSentiment)', async () => {
  fetchMock.post('/api/xml-sitemap', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate xml sitemap/i)); });

  expect(fetchMock.calls('/api/xml-sitemap').length).toBe(1);
  expect(screen.getByText(/xml sitemap generated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to generate an XML sitemap due to server error (from addSitemap_analyzeCommentSentiment)', async () => {
  fetchMock.post('/api/xml-sitemap', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate xml sitemap/i)); });

  expect(fetchMock.calls('/api/xml-sitemap').length).toBe(1);
  expect(screen.getByText(/failed to generate xml sitemap/i)).toBeInTheDocument();
}, 10000);

test('successfully analyzes comment sentiment (from addSitemap_analyzeCommentSentiment)', async () => {
  fetchMock.get('/api/analyzeCommentSentiment?postId=1', { status: 200, body: { sentiment: 'positive' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Analyze Sentiment')); });

  expect(fetchMock.calls('/api/analyzeCommentSentiment')).toHaveLength(1);
  expect(screen.getByText('Sentiment: positive')).toBeInTheDocument();
}, 10000);

test('fails to analyze comment sentiment with an error message (from addSitemap_analyzeCommentSentiment)', async () => {
  fetchMock.get('/api/analyzeCommentSentiment?postId=1', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Analyze Sentiment')); });

  expect(fetchMock.calls('/api/analyzeCommentSentiment')).toHaveLength(1);
  expect(screen.getByText('Error analyzing sentiment')).toBeInTheDocument();
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


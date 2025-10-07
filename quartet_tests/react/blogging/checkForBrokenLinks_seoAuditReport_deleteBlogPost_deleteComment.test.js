import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './checkForBrokenLinks_seoAuditReport_deleteBlogPost_deleteComment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully checks for broken links in a blog post (from checkForBrokenLinks_seoAuditReport)', async () => {
  fetchMock.post('/api/check-broken-links', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/check for broken links/i)); });

  expect(fetchMock.calls('/api/check-broken-links').length).toBe(1);
  expect(screen.getByText(/broken links checked successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to check for broken links in a blog post due to server error (from checkForBrokenLinks_seoAuditReport)', async () => {
  fetchMock.post('/api/check-broken-links', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/check for broken links/i)); });

  expect(fetchMock.calls('/api/check-broken-links').length).toBe(1);
  expect(screen.getByText(/failed to check for broken links/i)).toBeInTheDocument();
}, 10000);

test('successfully generates an SEO audit report (from checkForBrokenLinks_seoAuditReport)', async () => {
  fetchMock.post('/api/seo-audit', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate seo audit report/i)); });

  expect(fetchMock.calls('/api/seo-audit').length).toBe(1);
  expect(screen.getByText(/seo audit report generated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to generate an SEO audit report due to server error (from checkForBrokenLinks_seoAuditReport)', async () => {
  fetchMock.post('/api/seo-audit', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate seo audit report/i)); });

  expect(fetchMock.calls('/api/seo-audit').length).toBe(1);
  expect(screen.getByText(/failed to generate seo audit report/i)).toBeInTheDocument();
}, 10000);

test('Success: delete a blog post (from deleteBlogPost_deleteComment)', async () => {
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

test('Failure: delete a blog post without authorization (from deleteBlogPost_deleteComment)', async () => {
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

test('successfully deletes a comment (from deleteBlogPost_deleteComment)', async () => {
  fetchMock.delete('/api/comments/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete/i)); });

  expect(fetchMock.calls('/api/comments/1').length).toBe(1);
  expect(screen.getByText(/Comment deleted successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to delete a comment (from deleteBlogPost_deleteComment)', async () => {
  fetchMock.delete('/api/comments/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete/i)); });

  expect(fetchMock.calls('/api/comments/1').length).toBe(1);
  expect(screen.getByText(/Failed to delete comment/i)).toBeInTheDocument();
}, 10000);


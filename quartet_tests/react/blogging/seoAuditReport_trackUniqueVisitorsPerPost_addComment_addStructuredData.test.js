import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './seoAuditReport_trackUniqueVisitorsPerPost_addComment_addStructuredData';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully generates an SEO audit report (from seoAuditReport_trackUniqueVisitorsPerPost)', async () => {
  fetchMock.post('/api/seo-audit', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate seo audit report/i)); });

  expect(fetchMock.calls('/api/seo-audit').length).toBe(1);
  expect(screen.getByText(/seo audit report generated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to generate an SEO audit report due to server error (from seoAuditReport_trackUniqueVisitorsPerPost)', async () => {
  fetchMock.post('/api/seo-audit', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate seo audit report/i)); });

  expect(fetchMock.calls('/api/seo-audit').length).toBe(1);
  expect(screen.getByText(/failed to generate seo audit report/i)).toBeInTheDocument();
}, 10000);

test('successfully tracks unique visitors per post (from seoAuditReport_trackUniqueVisitorsPerPost)', async () => {
  fetchMock.post('/api/trackUniqueVisitors', { status: 200 });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Visit Post')); });

  expect(fetchMock.calls('/api/trackUniqueVisitors')).toHaveLength(1);
  expect(fetchMock.calls('/api/trackUniqueVisitors')[0][1].body).toContain('"postId":"1"');
  expect(screen.getByText('Unique Visitors: 1')).toBeInTheDocument();
}, 10000);

test('fails to track unique visitors with an error message (from seoAuditReport_trackUniqueVisitorsPerPost)', async () => {
  fetchMock.post('/api/trackUniqueVisitors', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Visit Post')); });

  expect(fetchMock.calls('/api/trackUniqueVisitors')).toHaveLength(1);
  expect(screen.getByText('Error tracking visitors')).toBeInTheDocument();
}, 10000);

test('successfully adds a comment to a post (from addComment_addStructuredData)', async () => {
  fetchMock.post('/api/comments', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText(/Add a comment/i), { target: { value: 'Great post!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Submit/i)); });

  expect(fetchMock.calls('/api/comments').length).toBe(1);
  expect(screen.getByText(/Comment added successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add a comment to a post (from addComment_addStructuredData)', async () => {
  fetchMock.post('/api/comments', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText(/Add a comment/i), { target: { value: 'Great post!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Submit/i)); });

  expect(fetchMock.calls('/api/comments').length).toBe(1);
  expect(screen.getByText(/Failed to add comment/i)).toBeInTheDocument();
}, 10000);

test('successfully adds structured data to a post (from addComment_addStructuredData)', async () => {
  fetchMock.post('/api/structured-data', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/structured data/i), { target: { value: '{ "type": "BlogPosting" }' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/structured-data').length).toBe(1);
  expect(screen.getByText(/structured data added successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add structured data to a post due to server error (from addComment_addStructuredData)', async () => {
  fetchMock.post('/api/structured-data', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/structured data/i), { target: { value: '{ "type": "BlogPosting" }' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/structured-data').length).toBe(1);
  expect(screen.getByText(/failed to add structured data/i)).toBeInTheDocument();
}, 10000);


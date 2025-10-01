import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './approveRejectComments_retrievePostsByTag_seoAuditReport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully approves a comment', async () => {
  fetchMock.put('/api/comments/approve/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Approve/i)); });

  expect(fetchMock.calls('/api/comments/approve/1').length).toBe(1);
  expect(screen.getByText(/Comment approved successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to approve a comment', async () => {
  fetchMock.put('/api/comments/approve/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Approve/i)); });

  expect(fetchMock.calls('/api/comments/approve/1').length).toBe(1);
  expect(screen.getByText(/Failed to approve comment/i)).toBeInTheDocument();
}, 10000);

test('User can retrieve posts by tag successfully', async () => {
  fetchMock.get('/tags/1/posts', {
    status: 200,
    body: [{ id: 1, title: 'First Post' }, { id: 2, title: 'Second Post' }]
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tag Select'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Posts')); });

  expect(fetchMock.calls('/tags/1/posts').length).toBe(1);
  expect(screen.getByText('First Post')).toBeInTheDocument();
  expect(screen.getByText('Second Post')).toBeInTheDocument();
}, 10000);

test('User gets an error message when retrieving posts by tag fails', async () => {
  fetchMock.get('/tags/1/posts', {
    status: 500,
    body: { error: 'Unable to fetch posts' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tag Select'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Posts')); });

  expect(fetchMock.calls('/tags/1/posts').length).toBe(1);
  expect(screen.getByText('Error: Unable to fetch posts')).toBeInTheDocument();
}, 10000);

test('successfully generates an SEO audit report', async () => {
  fetchMock.post('/api/seo-audit', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate seo audit report/i)); });

  expect(fetchMock.calls('/api/seo-audit').length).toBe(1);
  expect(screen.getByText(/seo audit report generated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to generate an SEO audit report due to server error', async () => {
  fetchMock.post('/api/seo-audit', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate seo audit report/i)); });

  expect(fetchMock.calls('/api/seo-audit').length).toBe(1);
  expect(screen.getByText(/failed to generate seo audit report/i)).toBeInTheDocument();
}, 10000);

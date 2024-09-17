import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './analyzeReaderEngagement_checkForBrokenLinks';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully analyzes reader engagement', async () => {
  fetchMock.get('/api/analyzeReaderEngagement?postId=1', { status: 200, body: { engagementScore: 85 } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Analyze Engagement')); });

  expect(fetchMock.calls('/api/analyzeReaderEngagement')).toHaveLength(1);
  expect(screen.getByText('Engagement Score: 85')).toBeInTheDocument();
}, 10000);

test('fails to analyze reader engagement with an error message', async () => {
  fetchMock.get('/api/analyzeReaderEngagement?postId=1', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Analyze Engagement')); });

  expect(fetchMock.calls('/api/analyzeReaderEngagement')).toHaveLength(1);
  expect(screen.getByText('Error analyzing engagement')).toBeInTheDocument();
}, 10000);

test('successfully checks for broken links in a blog post', async () => {
  fetchMock.post('/api/check-broken-links', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/check for broken links/i)); });

  expect(fetchMock.calls('/api/check-broken-links').length).toBe(1);
  expect(screen.getByText(/broken links checked successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to check for broken links in a blog post due to server error', async () => {
  fetchMock.post('/api/check-broken-links', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/check for broken links/i)); });

  expect(fetchMock.calls('/api/check-broken-links').length).toBe(1);
  expect(screen.getByText(/failed to check for broken links/i)).toBeInTheDocument();
}, 10000);
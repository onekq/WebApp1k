import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addSitemap_analyzeCommentSentiment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully generates an XML sitemap', async () => {
  fetchMock.post('/api/xml-sitemap', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate xml sitemap/i)); });

  expect(fetchMock.calls('/api/xml-sitemap').length).toBe(1);
  expect(screen.getByText(/xml sitemap generated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to generate an XML sitemap due to server error', async () => {
  fetchMock.post('/api/xml-sitemap', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate xml sitemap/i)); });

  expect(fetchMock.calls('/api/xml-sitemap').length).toBe(1);
  expect(screen.getByText(/failed to generate xml sitemap/i)).toBeInTheDocument();
}, 10000);

test('successfully analyzes comment sentiment', async () => {
  fetchMock.get('/api/analyzeCommentSentiment?postId=1', { status: 200, body: { sentiment: 'positive' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Analyze Sentiment')); });

  expect(fetchMock.calls('/api/analyzeCommentSentiment')).toHaveLength(1);
  expect(screen.getByText('Sentiment: positive')).toBeInTheDocument();
}, 10000);

test('fails to analyze comment sentiment with an error message', async () => {
  fetchMock.get('/api/analyzeCommentSentiment?postId=1', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Analyze Sentiment')); });

  expect(fetchMock.calls('/api/analyzeCommentSentiment')).toHaveLength(1);
  expect(screen.getByText('Error analyzing sentiment')).toBeInTheDocument();
}, 10000);
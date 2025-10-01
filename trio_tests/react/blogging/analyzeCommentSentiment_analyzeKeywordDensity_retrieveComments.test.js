import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './analyzeCommentSentiment_analyzeKeywordDensity_retrieveComments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('successfully analyzes keyword density of a post', async () => {
  fetchMock.post('/api/keyword-density', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/analyze keyword density/i)); });

  expect(fetchMock.calls('/api/keyword-density').length).toBe(1);
  expect(screen.getByText(/keyword density analyzed successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to analyze keyword density of a post due to server error', async () => {
  fetchMock.post('/api/keyword-density', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/analyze keyword density/i)); });

  expect(fetchMock.calls('/api/keyword-density').length).toBe(1);
  expect(screen.getByText(/failed to analyze keyword density/i)).toBeInTheDocument();
}, 10000);

test('successfully retrieves comments for a post', async () => {
  fetchMock.get('/api/comments?postId=1', [{ id: 1, content: 'Great post!' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/comments?postId=1').length).toBe(1);
  expect(screen.getByText(/Great post!/i)).toBeInTheDocument();
}, 10000);

test('fails to retrieve comments for a post', async () => {
  fetchMock.get('/api/comments?postId=1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/comments?postId=1').length).toBe(1);
  expect(screen.getByText(/Failed to retrieve comments/i)).toBeInTheDocument();
}, 10000);

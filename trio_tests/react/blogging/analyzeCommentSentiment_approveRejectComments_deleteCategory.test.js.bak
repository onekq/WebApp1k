import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './analyzeCommentSentiment_approveRejectComments_deleteCategory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully analyzes comment sentiment', async () => {
  fetchMock.get('/api/analyzeCommentSentiment?postId=1', { status: 200, body: { sentiment: 'positive' } });

  await act(async () => { render(<MemoryRouter><AnalyzeCommentSentiment postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Analyze Sentiment')); });

  expect(fetchMock.calls('/api/analyzeCommentSentiment')).toHaveLength(1);
  expect(screen.getByText('Sentiment: positive')).toBeInTheDocument();
}, 10000);

test('fails to analyze comment sentiment with an error message', async () => {
  fetchMock.get('/api/analyzeCommentSentiment?postId=1', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><AnalyzeCommentSentiment postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Analyze Sentiment')); });

  expect(fetchMock.calls('/api/analyzeCommentSentiment')).toHaveLength(1);
  expect(screen.getByText('Error analyzing sentiment')).toBeInTheDocument();
}, 10000);

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

test('User can delete a category successfully', async () => {
  fetchMock.delete('/categories/1', {
    status: 204
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Category')); });

  expect(fetchMock.calls('/categories/1').length).toBe(1);
  expect(screen.getByText('Category deleted successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when deleting a category fails', async () => {
  fetchMock.delete('/categories/1', {
    status: 500,
    body: { error: 'Unable to delete category' }
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Category')); });

  expect(fetchMock.calls('/categories/1').length).toBe(1);
  expect(screen.getByText('Error: Unable to delete category')).toBeInTheDocument();
}, 10000);

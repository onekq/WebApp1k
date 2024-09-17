import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './analyzeReaderEngagement_deleteComment';

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

test('successfully deletes a comment', async () => {
  fetchMock.delete('/api/comments/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete/i)); });

  expect(fetchMock.calls('/api/comments/1').length).toBe(1);
  expect(screen.getByText(/Comment deleted successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to delete a comment', async () => {
  fetchMock.delete('/api/comments/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete/i)); });

  expect(fetchMock.calls('/api/comments/1').length).toBe(1);
  expect(screen.getByText(/Failed to delete comment/i)).toBeInTheDocument();
}, 10000);
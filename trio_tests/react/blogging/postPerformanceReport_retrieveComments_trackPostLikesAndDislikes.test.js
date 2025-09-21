import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './postPerformanceReport_retrieveComments_trackPostLikesAndDislikes';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully generates post performance report', async () => {
  fetchMock.get('/api/generatePostPerformanceReport?postId=1', { status: 200, body: { performance: 'high' } });

  await act(async () => { render(<MemoryRouter><GeneratePostPerformanceReport postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Report')); });

  expect(fetchMock.calls('/api/generatePostPerformanceReport')).toHaveLength(1);
  expect(screen.getByText('Performance: high')).toBeInTheDocument();
}, 10000);

test('fails to generate post performance report with an error message', async () => {
  fetchMock.get('/api/generatePostPerformanceReport?postId=1', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><GeneratePostPerformanceReport postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Report')); });

  expect(fetchMock.calls('/api/generatePostPerformanceReport')).toHaveLength(1);
  expect(screen.getByText('Error generating report')).toBeInTheDocument();
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

test('successfully tracks post likes and dislikes', async () => {
  fetchMock.post('/api/trackPostLikesDislikes', { status: 200 });

  await act(async () => { render(<MemoryRouter><TrackPostLikesDislikes postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like Post')); });

  expect(fetchMock.calls('/api/trackPostLikesDislikes')).toHaveLength(1);
  expect(fetchMock.calls('/api/trackPostLikesDislikes')[0][1].body).toContain('"postId":"1"');
  expect(screen.getByText('Likes: 1')).toBeInTheDocument();
  await act(async () => { fireEvent.click(screen.getByText('Dislike Post')); });
  expect(screen.getByText('Dislikes: 1')).toBeInTheDocument();
}, 10000);

test('fails to track post likes and dislikes with an error message', async () => {
  fetchMock.post('/api/trackPostLikesDislikes', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><TrackPostLikesDislikes postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like Post')); });

  expect(fetchMock.calls('/api/trackPostLikesDislikes')).toHaveLength(1);
  expect(screen.getByText('Error tracking likes and dislikes')).toBeInTheDocument();
}, 10000);

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './reportComment_trackUniqueVisitorsPerPost';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully reports a comment', async () => {
  fetchMock.post('/api/comments/report/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Report/i)); });

  expect(fetchMock.calls('/api/comments/report/1').length).toBe(1);
  expect(screen.getByText(/Comment reported successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to report a comment', async () => {
  fetchMock.post('/api/comments/report/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Report/i)); });

  expect(fetchMock.calls('/api/comments/report/1').length).toBe(1);
  expect(screen.getByText(/Failed to report comment/i)).toBeInTheDocument();
}, 10000);

test('successfully tracks unique visitors per post', async () => {
  fetchMock.post('/api/trackUniqueVisitors', { status: 200 });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Visit Post')); });

  expect(fetchMock.calls('/api/trackUniqueVisitors')).toHaveLength(1);
  expect(fetchMock.calls('/api/trackUniqueVisitors')[0][1].body).toContain('"postId":"1"');
  expect(screen.getByText('Unique Visitors: 1')).toBeInTheDocument();
}, 10000);

test('fails to track unique visitors with an error message', async () => {
  fetchMock.post('/api/trackUniqueVisitors', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Visit Post')); });

  expect(fetchMock.calls('/api/trackUniqueVisitors')).toHaveLength(1);
  expect(screen.getByText('Error tracking visitors')).toBeInTheDocument();
}, 10000);
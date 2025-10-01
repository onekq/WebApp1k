import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addCanonicalUrl_retrieveCommentCount_trackPostShares';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully adds a canonical URL to a post', async () => {
  fetchMock.post('/api/canonical-url', { status: 200 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/canonical url/i), { target: { value: 'http://example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/canonical-url').length).toBe(1);
  expect(screen.getByText(/canonical url updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add a canonical URL to a post due to server error', async () => {
  fetchMock.post('/api/canonical-url', { status: 500 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/canonical url/i), { target: { value: 'http://example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/canonical-url').length).toBe(1);
  expect(screen.getByText(/failed to update canonical url/i)).toBeInTheDocument();
}, 10000);

test('successfully retrieves comment count for a post', async () => {
  fetchMock.get('/api/comments/count?postId=1', { count: 10 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/comments/count?postId=1').length).toBe(1);
  expect(screen.getByText(/10 comments/i)).toBeInTheDocument();
}, 10000);

test('fails to retrieve comment count for a post', async () => {
  fetchMock.get('/api/comments/count?postId=1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/comments/count?postId=1').length).toBe(1);
  expect(screen.getByText(/Failed to retrieve comment count/i)).toBeInTheDocument();
}, 10000);

test('successfully tracks post shares on social media', async () => {
  fetchMock.post('/api/trackPostShares', { status: 200 });

  await act(async () => { render(<MemoryRouter><TrackPostShares postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share Post')); });

  expect(fetchMock.calls('/api/trackPostShares')).toHaveLength(1);
  expect(fetchMock.calls('/api/trackPostShares')[0][1].body).toContain('"postId":"1"');
  expect(screen.getByText('Shares: 1')).toBeInTheDocument();
}, 10000);

test('fails to track post shares with an error message', async () => {
  fetchMock.post('/api/trackPostShares', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><TrackPostShares postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share Post')); });

  expect(fetchMock.calls('/api/trackPostShares')).toHaveLength(1);
  expect(screen.getByText('Error tracking shares')).toBeInTheDocument();
}, 10000);

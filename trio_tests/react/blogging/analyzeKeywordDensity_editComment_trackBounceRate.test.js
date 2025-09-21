import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './analyzeKeywordDensity_editComment_trackBounceRate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully analyzes keyword density of a post', async () => {
  fetchMock.post('/api/keyword-density', { status: 200 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/analyze keyword density/i)); });

  expect(fetchMock.calls('/api/keyword-density').length).toBe(1);
  expect(screen.getByText(/keyword density analyzed successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to analyze keyword density of a post due to server error', async () => {
  fetchMock.post('/api/keyword-density', { status: 500 });

  await act(async () => { render(<MemoryRouter><CMS /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/analyze keyword density/i)); });

  expect(fetchMock.calls('/api/keyword-density').length).toBe(1);
  expect(screen.getByText(/failed to analyze keyword density/i)).toBeInTheDocument();
}, 10000);

test('successfully edits a comment', async () => {
  fetchMock.put('/api/comments/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText(/Edit your comment/i), { target: { value: 'Updated comment!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Edit/i)); });

  expect(fetchMock.calls('/api/comments/1').length).toBe(1);
  expect(screen.getByText(/Comment updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to edit a comment', async () => {
  fetchMock.put('/api/comments/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText(/Edit your comment/i), { target: { value: 'Updated comment!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Edit/i)); });

  expect(fetchMock.calls('/api/comments/1').length).toBe(1);
  expect(screen.getByText(/Failed to update comment/i)).toBeInTheDocument();
}, 10000);

test('successfully tracks bounce rate', async () => {
  fetchMock.post('/api/trackBounceRate', { status: 200 });

  await act(async () => { render(<MemoryRouter><TrackBounceRate postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Track Bounce Rate')); });

  expect(fetchMock.calls('/api/trackBounceRate')).toHaveLength(1);
  expect(screen.getByText('Bounce Rate: 50%')).toBeInTheDocument();
}, 10000);

test('fails to track bounce rate with an error message', async () => {
  fetchMock.post('/api/trackBounceRate', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><TrackBounceRate postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Track Bounce Rate')); });

  expect(fetchMock.calls('/api/trackBounceRate')).toHaveLength(1);
  expect(screen.getByText('Error tracking bounce rate')).toBeInTheDocument();
}, 10000);

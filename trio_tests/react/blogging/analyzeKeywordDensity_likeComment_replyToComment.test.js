import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './analyzeKeywordDensity_likeComment_replyToComment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('successfully likes a comment', async () => {
  fetchMock.post('/api/comments/like/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Like/i)); });

  expect(fetchMock.calls('/api/comments/like/1').length).toBe(1);
  expect(screen.getByText(/Comment liked successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to like a comment', async () => {
  fetchMock.post('/api/comments/like/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Like/i)); });

  expect(fetchMock.calls('/api/comments/like/1').length).toBe(1);
  expect(screen.getByText(/Failed to like comment/i)).toBeInTheDocument();
}, 10000);

test('successfully replies to a comment', async () => {
  fetchMock.post('/api/comments/reply', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText(/Reply to a comment/i), { target: { value: 'Thanks for your comment!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Reply/i)); });

  expect(fetchMock.calls('/api/comments/reply').length).toBe(1);
  expect(screen.getByText(/Reply added successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to reply to a comment', async () => {
  fetchMock.post('/api/comments/reply', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText(/Reply to a comment/i), { target: { value: 'Thanks for your comment!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Reply/i)); });

  expect(fetchMock.calls('/api/comments/reply').length).toBe(1);
  expect(screen.getByText(/Failed to add reply/i)).toBeInTheDocument();
}, 10000);

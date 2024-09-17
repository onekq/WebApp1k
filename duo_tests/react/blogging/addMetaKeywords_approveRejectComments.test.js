import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addMetaKeywords_approveRejectComments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully generates and adds meta keywords to a post', async () => {
  fetchMock.post('/api/meta-keywords', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate meta keywords/i)); });

  expect(fetchMock.calls('/api/meta-keywords').length).toBe(1);
  expect(screen.getByText(/meta keywords generated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to generate and add meta keywords to a post due to server error', async () => {
  fetchMock.post('/api/meta-keywords', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate meta keywords/i)); });

  expect(fetchMock.calls('/api/meta-keywords').length).toBe(1);
  expect(screen.getByText(/failed to generate meta keywords/i)).toBeInTheDocument();
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
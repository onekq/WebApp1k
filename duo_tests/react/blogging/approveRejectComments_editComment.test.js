import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './approveRejectComments_editComment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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
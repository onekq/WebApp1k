import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addComment_addStructuredData';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds a comment to a post', async () => {
  fetchMock.post('/api/comments', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText(/Add a comment/i), { target: { value: 'Great post!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Submit/i)); });

  expect(fetchMock.calls('/api/comments').length).toBe(1);
  expect(screen.getByText(/Comment added successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add a comment to a post', async () => {
  fetchMock.post('/api/comments', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText(/Add a comment/i), { target: { value: 'Great post!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Submit/i)); });

  expect(fetchMock.calls('/api/comments').length).toBe(1);
  expect(screen.getByText(/Failed to add comment/i)).toBeInTheDocument();
}, 10000);

test('successfully adds structured data to a post', async () => {
  fetchMock.post('/api/structured-data', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/structured data/i), { target: { value: '{ "type": "BlogPosting" }' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/structured-data').length).toBe(1);
  expect(screen.getByText(/structured data added successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add structured data to a post due to server error', async () => {
  fetchMock.post('/api/structured-data', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/structured data/i), { target: { value: '{ "type": "BlogPosting" }' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/structured-data').length).toBe(1);
  expect(screen.getByText(/failed to add structured data/i)).toBeInTheDocument();
}, 10000);
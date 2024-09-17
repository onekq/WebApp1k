import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addMetaTitle_trackPostShares';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds a meta title to a post', async () => {
  fetchMock.post('/api/meta-title', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/meta title/i), { target: { value: 'New Meta Title' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/meta-title').length).toBe(1);
  expect(screen.getByText(/meta title updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add a meta title to a post due to server error', async () => {
  fetchMock.post('/api/meta-title', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/meta title/i), { target: { value: 'New Meta Title' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/meta-title').length).toBe(1);
  expect(screen.getByText(/failed to update meta title/i)).toBeInTheDocument();
}, 10000);

test('successfully tracks post shares on social media', async () => {
  fetchMock.post('/api/trackPostShares', { status: 200 });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share Post')); });

  expect(fetchMock.calls('/api/trackPostShares')).toHaveLength(1);
  expect(fetchMock.calls('/api/trackPostShares')[0][1].body).toContain('"postId":"1"');
  expect(screen.getByText('Shares: 1')).toBeInTheDocument();
}, 10000);

test('fails to track post shares with an error message', async () => {
  fetchMock.post('/api/trackPostShares', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share Post')); });

  expect(fetchMock.calls('/api/trackPostShares')).toHaveLength(1);
  expect(screen.getByText('Error tracking shares')).toBeInTheDocument();
}, 10000);
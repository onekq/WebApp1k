import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './coverPhotoUpdate_feedPostOrdering_userUnblocking';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Cover photo update succeeds with valid image', async () => {
  fetchMock.put('/api/profile/cover-photo', { body: { message: 'Cover photo updated' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cover-photo'), { target: { files: [new File([], 'cover.jpg', { type: 'image/jpeg' })] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Cover Photo')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Cover photo updated')).toBeInTheDocument();
}, 10000);

test('Cover photo update fails with invalid image', async () => {
  fetchMock.put('/api/profile/cover-photo', { body: { error: 'Invalid image format' }, status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cover-photo'), { target: { files: [new File([], 'cover.txt', { type: 'text/plain' })] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Cover Photo')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid image format')).toBeInTheDocument();
}, 10000);

test('Successfully orders posts in feed.', async () => {
  fetchMock.get('/api/feed?order=popular', {
    status: 200, body: [{ id: 1, content: 'Most popular post' }]
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText('Order By'), { target: { value: 'popular' } });
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Most popular post')).toBeInTheDocument();
}, 10000);

test('Shows error message when ordering posts fails.', async () => {
  fetchMock.get('/api/feed?order=popular', {
    status: 500, body: { message: 'Failed to order posts' }
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText('Order By'), { target: { value: 'popular' } });
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to order posts')).toBeInTheDocument();
}, 10000);

test('User unblocking succeeds for valid user', async () => {
  fetchMock.post('/api/profile/unblock', { body: { message: 'User unblocked' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App userId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Unblock User')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('User unblocked')).toBeInTheDocument();
}, 10000);

test('User unblocking fails for not blocked user', async () => {
  fetchMock.post('/api/profile/unblock', { body: { error: 'User not blocked' }, status: 400 });

  await act(async () => { render(<MemoryRouter><App userId={9999} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Unblock User')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('User not blocked')).toBeInTheDocument();
}, 10000);

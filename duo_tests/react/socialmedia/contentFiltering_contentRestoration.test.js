import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contentFiltering_contentRestoration';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Filters posts by hashtags successfully.', async () => {
  fetchMock.post('/api/filter', {
    status: 200, body: [{ id: 1, content: 'Hashtag post' }]
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('#Hashtag'), { target: { value: 'test' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Hashtag post')).toBeInTheDocument();
}, 10000);

test('Shows error message for invalid hashtag filter.', async () => {
  fetchMock.post('/api/filter', {
    status: 400, body: { message: 'Invalid hashtag' }
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('#Hashtag'), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid hashtag')).toBeInTheDocument();
}, 10000);

test('Successfully restores an archived post.', async () => {
  fetchMock.post('/api/restore', {
    status: 200, body: { message: 'Post restored' }
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Restore'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post restored')).toBeInTheDocument();
}, 10000);

test('Shows error message when restoring an archived post fails.', async () => {
  fetchMock.post('/api/restore', {
    status: 500, body: { message: 'Failed to restore post' }
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Restore'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to restore post')).toBeInTheDocument();
}, 10000);
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contentSearch_postDraftSaving';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully searches and displays posts.', async () => {
  fetchMock.post('/api/search', {
    status: 200, body: [{ id: 1, content: 'Search result' }]
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'test' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Search'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Search result')).toBeInTheDocument();
}, 10000);

test('Shows error message for invalid search query.', async () => {
  fetchMock.post('/api/search', {
    status: 400, body: { message: 'Invalid search query' }
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Search'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid search query')).toBeInTheDocument();
}, 10000);

test('Verify saving posts as drafts.', async () => {
  fetchMock.post('/api/posts/draft', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Write a post...'), { target: { value: 'Save as draft content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save as Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft saved successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure error handling for saving drafts.', async () => {
  fetchMock.post('/api/posts/draft', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Write a post...'), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save as Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save draft.')).toBeInTheDocument();
}, 10000);
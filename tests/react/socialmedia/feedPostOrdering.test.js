import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import OrderComponent from './feedPostOrdering';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully orders posts in feed.', async () => {
  fetchMock.get('/api/feed?order=popular', {
    status: 200, body: [{ id: 1, content: 'Most popular post' }]
  });

  await act(async () => {
    render(<MemoryRouter><OrderComponent /></MemoryRouter>);
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
    render(<MemoryRouter><OrderComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText('Order By'), { target: { value: 'popular' } });
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to order posts')).toBeInTheDocument();
}, 10000);
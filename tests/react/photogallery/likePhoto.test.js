import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './likePhoto';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should successfully like a photo.', async () => {
  fetchMock.post('/api/photo/like', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('like-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('like-icon')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to like a photo.', async () => {
  fetchMock.post('/api/photo/like', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('like-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to like photo')).toBeInTheDocument();
}, 10000);


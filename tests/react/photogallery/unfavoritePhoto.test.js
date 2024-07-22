import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './unfavoritePhoto';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should successfully unmark a photo as favorite.', async () => {
  fetchMock.post('/api/photo/unfavorite', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('unfavorite-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('unfavorite-icon')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to unmark a photo as favorite.', async () => {
  fetchMock.post('/api/photo/unfavorite', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('unfavorite-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to unfavorite photo')).toBeInTheDocument();
}, 10000);


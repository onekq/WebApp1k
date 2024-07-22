import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './favoritePhoto';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should successfully mark a photo as favorite.', async () => {
  fetchMock.post('/api/photo/favorite', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('favorite-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('favorite-icon')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to mark a photo as favorite.', async () => {
  fetchMock.post('/api/photo/favorite', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('favorite-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to favorite photo')).toBeInTheDocument();
}, 10000);


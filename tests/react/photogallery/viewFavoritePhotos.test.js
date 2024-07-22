import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './viewFavoritePhotos';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should successfully view all favorite photos.', async () => {
  fetchMock.get('/api/photo/favorites', { status: 200, body: { photos: ['Photo 1', 'Photo 2'] } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-favorites-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Photo 1')).toBeInTheDocument();
  expect(screen.getByText('Photo 2')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to view all favorite photos.', async () => {
  fetchMock.get('/api/photo/favorites', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-favorites-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load favorite photos')).toBeInTheDocument();
}, 10000);


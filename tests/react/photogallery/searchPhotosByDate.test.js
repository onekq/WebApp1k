import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SearchPhotos from './searchPhotosByDate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should successfully search photos by date', async () => {
  fetchMock.get('/api/search?date=2021-01-01', { photos: [{ id: 1, date: '2021-01-01' }] });

  await act(async () => { render(<MemoryRouter><SearchPhotos /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: '2021-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('photo-1')).toBeInTheDocument();
}, 10000);

test('should fail to search photos by date with error message', async () => {
  fetchMock.get('/api/search?date=2021-01-01', 404);

  await act(async () => { render(<MemoryRouter><SearchPhotos /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: '2021-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No photos found')).toBeInTheDocument();
}, 10000);


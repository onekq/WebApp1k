import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterPhotosByAlbum_photoEditingAdjustments_sortPhotosByDate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Filter Photos by Album: success', async () => {
  fetchMock.get('/api/photos?album=AlbumID', { body: [{ id: 1, name: 'Photo1' }] });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('album-filter-input'), { target: { value: 'AlbumID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('filter-button'));
  });

  expect(fetchMock.calls('/api/photos?album=AlbumID')).toHaveLength(1);
  expect(screen.getByTestId('photo-1')).toBeInTheDocument();
}, 10000);

test('Filter Photos by Album: failure', async () => {
  fetchMock.get('/api/photos?album=AlbumID', { throws: new Error('Filter Failed') });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('album-filter-input'), { target: { value: 'AlbumID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('filter-button'));
  });

  expect(fetchMock.calls('/api/photos?album=AlbumID')).toHaveLength(1);
  expect(screen.getByTestId('filter-failure')).toBeInTheDocument();
}, 10000);

test('should successfully adjust photo settings', async () => {
  fetchMock.post('/api/adjustments', { id: 1, adjusted: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('adjustments-input'), { target: { value: 'brightness|10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('adjustments-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Photo adjusted')).toBeInTheDocument();
}, 10000);

test('should fail to adjust photo settings with error message', async () => {
  fetchMock.post('/api/adjustments', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('adjustments-input'), { target: { value: 'brightness|10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('adjustments-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to adjust photo')).toBeInTheDocument();
}, 10000);

test('Users can successfully sort photos by date.', async () => {
  fetchMock.get('/api/sort-photos-by-date', { success: true, data: ['photo1', 'photo2'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-by-date-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Photos sorted by date')).toBeInTheDocument();
}, 10000);

test('Shows an error message when sorting photos by date fails.', async () => {
  fetchMock.get('/api/sort-photos-by-date', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-by-date-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to sort photos by date')).toBeInTheDocument();
}, 10000);

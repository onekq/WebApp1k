import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './sortPhotosByName_tagRemoval_viewComments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Users can successfully sort photos by name.', async () => {
  fetchMock.get('/api/sort-photos-by-name', { success: true, data: ['photoA', 'photoB'] });

  await act(async () => { render(<MemoryRouter><SortPhotosByNameComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-by-name-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Photos sorted by name')).toBeInTheDocument();
}, 10000);

test('Shows an error message when sorting photos by name fails.', async () => {
  fetchMock.get('/api/sort-photos-by-name', { success: false });

  await act(async () => { render(<MemoryRouter><SortPhotosByNameComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-by-name-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to sort photos by name')).toBeInTheDocument();
}, 10000);

test('Users can successfully remove tags from photos.', async () => {
  fetchMock.delete('/api/tags', { success: true });

  await act(async () => { render(<MemoryRouter><TagRemovalComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.queryByText('Nature')).not.toBeInTheDocument();
}, 10000);

test('Shows an error message when tag removal fails.', async () => {
  fetchMock.delete('/api/tags', { success: false });

  await act(async () => { render(<MemoryRouter><TagRemovalComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to remove tag')).toBeInTheDocument();
}, 10000);

test('Should successfully view comments on a photo.', async () => {
  fetchMock.get('/api/photo/comments', { status: 200, body: { comments: ['Comment 1', 'Comment 2'] } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-comments-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Comment 1')).toBeInTheDocument();
  expect(screen.getByText('Comment 2')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to view comments on a photo.', async () => {
  fetchMock.get('/api/photo/comments', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-comments-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load comments')).toBeInTheDocument();
}, 10000);

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteComment_photoEditingRotate_sortPhotosByDate_sortPhotosByTag';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should successfully delete a comment. (from deleteComment_photoEditingRotate)', async () => {
  fetchMock.delete('/api/photo/deleteComment', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-comment-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.queryByTestId('comment-to-delete')).not.toBeInTheDocument();
}, 10000);

test('Should show error message when failing to delete a comment. (from deleteComment_photoEditingRotate)', async () => {
  fetchMock.delete('/api/photo/deleteComment', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-comment-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to delete comment')).toBeInTheDocument();
}, 10000);

test('should successfully rotate a photo (from deleteComment_photoEditingRotate)', async () => {
  fetchMock.post('/api/rotate', { id: 1, rotated: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rotate-input'), { target: { value: '90' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rotate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Photo rotated')).toBeInTheDocument();
}, 10000);

test('should fail to rotate a photo with error message (from deleteComment_photoEditingRotate)', async () => {
  fetchMock.post('/api/rotate', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rotate-input'), { target: { value: '90' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rotate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to rotate photo')).toBeInTheDocument();
}, 10000);

test('Users can successfully sort photos by date. (from sortPhotosByDate_sortPhotosByTag)', async () => {
  fetchMock.get('/api/sort-photos-by-date', { success: true, data: ['photo1', 'photo2'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-by-date-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Photos sorted by date')).toBeInTheDocument();
}, 10000);

test('Shows an error message when sorting photos by date fails. (from sortPhotosByDate_sortPhotosByTag)', async () => {
  fetchMock.get('/api/sort-photos-by-date', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-by-date-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to sort photos by date')).toBeInTheDocument();
}, 10000);

test('should successfully sort photos by tag (from sortPhotosByDate_sortPhotosByTag)', async () => {
  fetchMock.get('/api/sort?tag=sunset', { photos: [{ id: 1, tag: 'sunset' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sort-input'), { target: { value: 'sunset' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('photo-1')).toBeInTheDocument();
}, 10000);

test('should fail to sort photos by tag with error message (from sortPhotosByDate_sortPhotosByTag)', async () => {
  fetchMock.get('/api/sort?tag=sunset', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sort-input'), { target: { value: 'sunset' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No photos found')).toBeInTheDocument();
}, 10000);


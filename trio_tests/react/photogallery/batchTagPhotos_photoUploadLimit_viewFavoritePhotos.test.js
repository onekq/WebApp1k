import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './batchTagPhotos_photoUploadLimit_viewFavoritePhotos';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Users can successfully batch tag multiple photos.', async () => {
  fetchMock.post('/api/batch-tags', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('batch-tag-input'), { target: { value: 'Holiday' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('batch-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Batch tagged photos')).toBeInTheDocument();
}, 10000);

test('Shows an error message when batch tagging photos fails.', async () => {
  fetchMock.post('/api/batch-tags', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('batch-tag-input'), { target: { value: 'Holiday' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('batch-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to batch tag photos')).toBeInTheDocument();
}, 10000);

test('adheres to photo upload size limit', async () => {
  fetchMock.post('/upload', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    const file = new File(['a'.repeat(2 * 1024 * 1024)], 'large.png', { type: 'image/png' });
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('upload-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('upload-success-message')).toBeInTheDocument();
}, 10000);

test('fails when photo exceeds size limit', async () => {
  fetchMock.post('/upload', { status: 413 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    const file = new File(['a'.repeat(7 * 1024 * 1024)], 'large.png', { type: 'image/png' });
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('upload-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/file too large/i)).toBeInTheDocument();
}, 10000);

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

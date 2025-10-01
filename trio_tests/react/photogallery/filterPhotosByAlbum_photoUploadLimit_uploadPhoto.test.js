import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterPhotosByAlbum_photoUploadLimit_uploadPhoto';

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

test('uploads a photo successfully', async () => {
  fetchMock.post('/upload', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  
  await act(async () => {
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [new File(['dummy content'], 'example.png', { type: 'image/png' })] } });
  });
  
  await act(async () => {
    fireEvent.click(screen.getByTestId('upload-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('upload-success-message')).toBeInTheDocument();
}, 10000);

test('fails to upload a photo', async () => {
  fetchMock.post('/upload', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [new File(['dummy content'], 'example.png', { type: 'image/png' })] } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('upload-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/upload failed/i)).toBeInTheDocument();
}, 10000);

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './photoMetadataExtraction_slideshowView_viewFavoritePhotos';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('extracts photo metadata correctly', async () => {
  fetchMock.post('/upload', { status: 200, body: { metadata: { date: '2021-01-01', location: 'Paris' } } });

  await act(async () => {
    render(<MemoryRouter><PhotoUploadComponent /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [new File(['dummy content'], 'example.png', { type: 'image/png' })] } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('upload-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Date: 2021-01-01/)).toBeInTheDocument();
  expect(screen.getByText(/Location: Paris/)).toBeInTheDocument();
}, 10000);

test('fails to extract photo metadata', async () => {
  fetchMock.post('/upload', { status: 200, body: {} });

  await act(async () => {
    render(<MemoryRouter><PhotoUploadComponent /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [new File(['dummy content'], 'example.png', { type: 'image/png' })] } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('upload-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/metadata extraction failed/i)).toBeInTheDocument();
}, 10000);

test('should successfully view photos in slideshow mode', async () => {
  fetchMock.get('/api/photos', { photos: [{ id: 1 }] });

  await act(async () => { render(<MemoryRouter><Slideshow /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('start-slideshow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('photo-1')).toBeInTheDocument();
}, 10000);

test('should fail to view photos in slideshow mode with error message', async () => {
  fetchMock.get('/api/photos', 404);

  await act(async () => { render(<MemoryRouter><Slideshow /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('start-slideshow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Cannot load slideshow')).toBeInTheDocument();
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

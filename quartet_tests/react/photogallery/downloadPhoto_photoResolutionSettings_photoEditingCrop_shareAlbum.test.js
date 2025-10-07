import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './downloadPhoto_photoResolutionSettings_photoEditingCrop_shareAlbum';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('downloads a photo successfully (from downloadPhoto_photoResolutionSettings)', async () => {
  fetchMock.get('/download/1', { status: 200, body: 'image binary data' });

  await act(async () => {
    render(<MemoryRouter><App id="1" /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('download-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/photo downloaded/i)).toBeInTheDocument();
}, 10000);

test('fails to download a photo (from downloadPhoto_photoResolutionSettings)', async () => {
  fetchMock.get('/download/1', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App id="1" /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('download-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/download failed/i)).toBeInTheDocument();
}, 10000);

test('should successfully set the resolution for viewing photos (from downloadPhoto_photoResolutionSettings)', async () => {
  fetchMock.post('/api/resolution', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resolution-input'), { target: { value: '1080p' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('resolution-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Resolution set')).toBeInTheDocument();
}, 10000);

test('should fail to set the resolution for viewing photos with error message (from downloadPhoto_photoResolutionSettings)', async () => {
  fetchMock.post('/api/resolution', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resolution-input'), { target: { value: '1080p' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('resolution-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to set resolution')).toBeInTheDocument();
}, 10000);

test('should successfully crop a photo (from photoEditingCrop_shareAlbum)', async () => {
  fetchMock.post('/api/crop', { id: 1, cropped: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('crop-input'), { target: { value: '100x100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('crop-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Photo cropped')).toBeInTheDocument();
}, 10000);

test('should fail to crop a photo with error message (from photoEditingCrop_shareAlbum)', async () => {
  fetchMock.post('/api/crop', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('crop-input'), { target: { value: '100x100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('crop-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to crop photo')).toBeInTheDocument();
}, 10000);

test('Share Album: success (from photoEditingCrop_shareAlbum)', async () => {
  fetchMock.post('/api/shareAlbum', { body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('album-input'), { target: { value: 'AlbumID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('share-album-button'));
  });

  expect(fetchMock.calls('/api/shareAlbum')).toHaveLength(1);
  expect(screen.getByTestId('share-album-success')).toBeInTheDocument();
}, 10000);

test('Share Album: failure (from photoEditingCrop_shareAlbum)', async () => {
  fetchMock.post('/api/shareAlbum', { throws: new Error('Share Failed') });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('album-input'), { target: { value: 'AlbumID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('share-album-button'));
  });

  expect(fetchMock.calls('/api/shareAlbum')).toHaveLength(1);
  expect(screen.getByTestId('share-album-failure')).toBeInTheDocument();
}, 10000);


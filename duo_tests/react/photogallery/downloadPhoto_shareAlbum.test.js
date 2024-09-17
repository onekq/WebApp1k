import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './downloadPhoto_shareAlbum';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('downloads a photo successfully', async () => {
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

test('fails to download a photo', async () => {
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

test('Share Album: success', async () => {
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

test('Share Album: failure', async () => {
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
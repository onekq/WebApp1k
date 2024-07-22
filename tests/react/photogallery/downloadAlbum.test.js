import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './downloadAlbum';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Download Album: success', async () => {
  fetchMock.post('/api/downloadAlbum', { body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('album-id-input'), { target: { value: 'AlbumID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('download-album-button'));
  });

  expect(fetchMock.calls('/api/downloadAlbum')).toHaveLength(1);
  expect(screen.getByTestId('download-success')).toBeInTheDocument();
}, 10000);

test('Download Album: failure', async () => {
  fetchMock.post('/api/downloadAlbum', { throws: new Error('Download Failed') });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('album-id-input'), { target: { value: 'AlbumID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('download-album-button'));
  });

  expect(fetchMock.calls('/api/downloadAlbum')).toHaveLength(1);
  expect(screen.getByTestId('download-failure')).toBeInTheDocument();
}, 10000);


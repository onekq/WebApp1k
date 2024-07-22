import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import RenameAlbumComponent from './renameAlbum';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Users can successfully rename an album.', async () => {
  fetchMock.put('/api/albums', { success: true });

  await act(async () => { render(<MemoryRouter><RenameAlbumComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('album-name-input'), { target: { value: 'NewAlbumName' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rename-album-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('NewAlbumName')).toBeInTheDocument();
}, 10000);

test('Shows an error message when renaming album fails.', async () => {
  fetchMock.put('/api/albums', { success: false });

  await act(async () => { render(<MemoryRouter><RenameAlbumComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('album-name-input'), { target: { value: 'NewAlbumName' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rename-album-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to rename album')).toBeInTheDocument();
}, 10000);


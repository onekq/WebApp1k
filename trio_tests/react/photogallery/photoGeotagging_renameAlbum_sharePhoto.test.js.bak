import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './photoGeotagging_renameAlbum_sharePhoto';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should successfully add/edit geotags on a photo', async () => {
  fetchMock.post('/api/geotag', { id: 1, geotag: 'Paris' });

  await act(async () => { render(<MemoryRouter><GeotagPhoto /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('geotag-input'), { target: { value: 'Paris' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('geotag-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Geotag added')).toBeInTheDocument();
}, 10000);

test('should fail to add/edit geotags on a photo with error message', async () => {
  fetchMock.post('/api/geotag', 404);

  await act(async () => { render(<MemoryRouter><GeotagPhoto /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('geotag-input'), { target: { value: 'Paris' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('geotag-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to add geotag')).toBeInTheDocument();
}, 10000);

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

test('Share Photo: success', async () => {
  fetchMock.post('/api/sharePhoto', { body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('photo-input'), { target: { value: 'PhotoID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('share-button'));
  });

  expect(fetchMock.calls('/api/sharePhoto')).toHaveLength(1);
  expect(screen.getByTestId('share-success')).toBeInTheDocument();
}, 10000);

test('Share Photo: failure', async () => {
  fetchMock.post('/api/sharePhoto', { throws: new Error('Share Failed') });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('photo-input'), { target: { value: 'PhotoID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('share-button'));
  });

  expect(fetchMock.calls('/api/sharePhoto')).toHaveLength(1);
  expect(screen.getByTestId('share-failure')).toBeInTheDocument();
}, 10000);

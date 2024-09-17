import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './removePhotoFromAlbum_revokeShare';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Users can successfully remove photos from an album.', async () => {
  fetchMock.delete('/api/albums/photos', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-photo-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.queryByText('Photo removed')).toBeInTheDocument();
}, 10000);

test('Shows an error message when removing photo from album fails.', async () => {
  fetchMock.delete('/api/albums/photos', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-photo-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to remove photo')).toBeInTheDocument();
}, 10000);

test('Revoke Share Link: success', async () => {
  fetchMock.post('/api/revokeShare', { body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('share-link-input'), { target: { value: 'link-id' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('revoke-share-button'));
  });

  expect(fetchMock.calls('/api/revokeShare')).toHaveLength(1);
  expect(screen.getByTestId('revoke-success')).toBeInTheDocument();
}, 10000);

test('Revoke Share Link: failure', async () => {
  fetchMock.post('/api/revokeShare', { throws: new Error('Revoke Failed') });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('share-link-input'), { target: { value: 'link-id' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('revoke-share-button'));
  });

  expect(fetchMock.calls('/api/revokeShare')).toHaveLength(1);
  expect(screen.getByTestId('revoke-failure')).toBeInTheDocument();
}, 10000);
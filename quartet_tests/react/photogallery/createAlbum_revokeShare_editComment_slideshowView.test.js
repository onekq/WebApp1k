import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './createAlbum_revokeShare_editComment_slideshowView';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Users can successfully create a new album. (from createAlbum_revokeShare)', async () => {
  fetchMock.post('/api/albums', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('album-name-input'), { target: { value: 'Vacation' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('create-album-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Vacation')).toBeInTheDocument();
}, 10000);

test('Shows an error message when album creation fails. (from createAlbum_revokeShare)', async () => {
  fetchMock.post('/api/albums', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('album-name-input'), { target: { value: 'Vacation' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('create-album-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to create album')).toBeInTheDocument();
}, 10000);

test('Revoke Share Link: success (from createAlbum_revokeShare)', async () => {
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

test('Revoke Share Link: failure (from createAlbum_revokeShare)', async () => {
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

test('Should successfully edit a comment. (from editComment_slideshowView)', async () => {
  fetchMock.put('/api/photo/editComment', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('edit-comment-input'), { target: { value: 'Edited comment!' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('edit-comment-submit'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('comment-Edited comment!')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to edit a comment. (from editComment_slideshowView)', async () => {
  fetchMock.put('/api/photo/editComment', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('edit-comment-input'), { target: { value: 'Edited comment!' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('edit-comment-submit'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to edit comment')).toBeInTheDocument();
}, 10000);

test('should successfully view photos in slideshow mode (from editComment_slideshowView)', async () => {
  fetchMock.get('/api/photos', { photos: [{ id: 1 }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('start-slideshow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('photo-1')).toBeInTheDocument();
}, 10000);

test('should fail to view photos in slideshow mode with error message (from editComment_slideshowView)', async () => {
  fetchMock.get('/api/photos', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('start-slideshow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Cannot load slideshow')).toBeInTheDocument();
}, 10000);


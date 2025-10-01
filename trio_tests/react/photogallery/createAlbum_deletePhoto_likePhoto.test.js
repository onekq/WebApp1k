import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './createAlbum_deletePhoto_likePhoto';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Users can successfully create a new album.', async () => {
  fetchMock.post('/api/albums', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('album-name-input'), { target: { value: 'Vacation' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('create-album-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Vacation')).toBeInTheDocument();
}, 10000);

test('Shows an error message when album creation fails.', async () => {
  fetchMock.post('/api/albums', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('album-name-input'), { target: { value: 'Vacation' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('create-album-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to create album')).toBeInTheDocument();
}, 10000);

test('deletes a photo successfully', async () => {
  fetchMock.delete('/photo/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-button-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/photo deleted/i)).toBeInTheDocument();
}, 10000);

test('fails to delete a photo', async () => {
  fetchMock.delete('/photo/1', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-button-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/delete failed/i)).toBeInTheDocument();
}, 10000);

test('Should successfully like a photo.', async () => {
  fetchMock.post('/api/photo/like', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('like-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('like-icon')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to like a photo.', async () => {
  fetchMock.post('/api/photo/like', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('like-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to like photo')).toBeInTheDocument();
}, 10000);

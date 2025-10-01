import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteAlbum_photoResolutionSettings_uploadPhoto';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Users can successfully delete an album.', async () => {
  fetchMock.delete('/api/albums', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-album-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.queryByText('Album deleted')).toBeInTheDocument();
}, 10000);

test('Shows an error message when deleting album fails.', async () => {
  fetchMock.delete('/api/albums', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-album-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to delete album')).toBeInTheDocument();
}, 10000);

test('should successfully set the resolution for viewing photos', async () => {
  fetchMock.post('/api/resolution', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resolution-input'), { target: { value: '1080p' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('resolution-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Resolution set')).toBeInTheDocument();
}, 10000);

test('should fail to set the resolution for viewing photos with error message', async () => {
  fetchMock.post('/api/resolution', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resolution-input'), { target: { value: '1080p' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('resolution-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to set resolution')).toBeInTheDocument();
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

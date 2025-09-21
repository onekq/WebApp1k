import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deletePhoto_duplicatePhotoDetection_photoTagging';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('deletes a photo successfully', async () => {
  fetchMock.delete('/photo/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><PhotoManagementComponent /></MemoryRouter>);
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
    render(<MemoryRouter><PhotoManagementComponent /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-button-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/delete failed/i)).toBeInTheDocument();
}, 10000);

test('detects a duplicate photo', async () => {
  fetchMock.post('/upload', { status: 409 });

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
  expect(screen.getByText(/duplicate photo detected/i)).toBeInTheDocument();
}, 10000);

test('does not detect a duplicate photo', async () => {
  fetchMock.post('/upload', { status: 200 });

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
  expect(screen.getByTestId('upload-success-message')).toBeInTheDocument();
}, 10000);

test('Users can successfully add tags to photos.', async () => {
  fetchMock.post('/api/tags', { success: true });

  await act(async () => { render(<MemoryRouter><PhotoTaggingComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input'), { target: { value: 'Nature' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Nature')).toBeInTheDocument();
}, 10000);

test('Shows an error message when tag addition fails.', async () => {
  fetchMock.post('/api/tags', { success: false });

  await act(async () => { render(<MemoryRouter><PhotoTaggingComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input'), { target: { value: 'Nature' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to add tag')).toBeInTheDocument();
}, 10000);

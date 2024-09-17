import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './batchUploadPhotos_editPhotoDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('batch uploads multiple photos successfully', async () => {
  fetchMock.post('/upload/batch', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    const files = [
      new File(['dummy content'], 'example1.png', { type: 'image/png' }),
      new File(['dummy content'], 'example2.png', { type: 'image/png' })
    ];
    fireEvent.change(screen.getByTestId('file-input'), { target: { files } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('upload-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('upload-success-message')).toBeInTheDocument();
}, 10000);

test('fails to batch upload multiple photos', async () => {
  fetchMock.post('/upload/batch', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    const files = [
      new File(['dummy content'], 'example1.png', { type: 'image/png' }),
      new File(['dummy content'], 'example2.png', { type: 'image/png' })
    ];
    fireEvent.change(screen.getByTestId('file-input'), { target: { files } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('upload-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/batch upload failed/i)).toBeInTheDocument();
}, 10000);

test('edits photo details successfully', async () => {
  fetchMock.put('/photo/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App id="1" /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'New Title' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('save-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/details updated/i)).toBeInTheDocument();
}, 10000);

test('fails to edit photo details', async () => {
  fetchMock.put('/photo/1', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App id="1" /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'New Title' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('save-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/update failed/i)).toBeInTheDocument();
}, 10000);
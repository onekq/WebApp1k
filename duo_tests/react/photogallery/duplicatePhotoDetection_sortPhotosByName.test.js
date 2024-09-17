import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './duplicatePhotoDetection_sortPhotosByName';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('detects a duplicate photo', async () => {
  fetchMock.post('/upload', { status: 409 });

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
  expect(screen.getByText(/duplicate photo detected/i)).toBeInTheDocument();
}, 10000);

test('does not detect a duplicate photo', async () => {
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

test('Users can successfully sort photos by name.', async () => {
  fetchMock.get('/api/sort-photos-by-name', { success: true, data: ['photoA', 'photoB'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-by-name-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Photos sorted by name')).toBeInTheDocument();
}, 10000);

test('Shows an error message when sorting photos by name fails.', async () => {
  fetchMock.get('/api/sort-photos-by-name', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-by-name-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to sort photos by name')).toBeInTheDocument();
}, 10000);
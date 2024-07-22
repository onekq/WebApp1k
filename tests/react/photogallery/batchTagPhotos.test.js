import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import BatchTagPhotosComponent from './batchTagPhotos';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Users can successfully batch tag multiple photos.', async () => {
  fetchMock.post('/api/batch-tags', { success: true });

  await act(async () => { render(<MemoryRouter><BatchTagPhotosComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('batch-tag-input'), { target: { value: 'Holiday' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('batch-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Batch tagged photos')).toBeInTheDocument();
}, 10000);

test('Shows an error message when batch tagging photos fails.', async () => {
  fetchMock.post('/api/batch-tags', { success: false });

  await act(async () => { render(<MemoryRouter><BatchTagPhotosComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('batch-tag-input'), { target: { value: 'Holiday' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('batch-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to batch tag photos')).toBeInTheDocument();
}, 10000);


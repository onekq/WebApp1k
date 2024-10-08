import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CoverPhotoUpdate from './coverPhotoUpdate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Cover photo update succeeds with valid image', async () => {
  fetchMock.put('/api/profile/cover-photo', { body: { message: 'Cover photo updated' }, status: 200 });

  await act(async () => { render(<MemoryRouter><CoverPhotoUpdate /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cover-photo'), { target: { files: [new File([], 'cover.jpg', { type: 'image/jpeg' })] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Cover Photo')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Cover photo updated')).toBeInTheDocument();
}, 10000);

test('Cover photo update fails with invalid image', async () => {
  fetchMock.put('/api/profile/cover-photo', { body: { error: 'Invalid image format' }, status: 400 });

  await act(async () => { render(<MemoryRouter><CoverPhotoUpdate /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cover-photo'), { target: { files: [new File([], 'cover.txt', { type: 'text/plain' })] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Cover Photo')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid image format')).toBeInTheDocument();
}, 10000);


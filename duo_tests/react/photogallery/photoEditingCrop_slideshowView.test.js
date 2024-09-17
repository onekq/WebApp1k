import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './photoEditingCrop_slideshowView';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should successfully crop a photo', async () => {
  fetchMock.post('/api/crop', { id: 1, cropped: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('crop-input'), { target: { value: '100x100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('crop-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Photo cropped')).toBeInTheDocument();
}, 10000);

test('should fail to crop a photo with error message', async () => {
  fetchMock.post('/api/crop', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('crop-input'), { target: { value: '100x100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('crop-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to crop photo')).toBeInTheDocument();
}, 10000);

test('should successfully view photos in slideshow mode', async () => {
  fetchMock.get('/api/photos', { photos: [{ id: 1 }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('start-slideshow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('photo-1')).toBeInTheDocument();
}, 10000);

test('should fail to view photos in slideshow mode with error message', async () => {
  fetchMock.get('/api/photos', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('start-slideshow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Cannot load slideshow')).toBeInTheDocument();
}, 10000);
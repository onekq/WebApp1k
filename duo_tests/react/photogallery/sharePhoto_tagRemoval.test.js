import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './sharePhoto_tagRemoval';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Share Photo: success', async () => {
  fetchMock.post('/api/sharePhoto', { body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('photo-input'), { target: { value: 'PhotoID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('share-button'));
  });

  expect(fetchMock.calls('/api/sharePhoto')).toHaveLength(1);
  expect(screen.getByTestId('share-success')).toBeInTheDocument();
}, 10000);

test('Share Photo: failure', async () => {
  fetchMock.post('/api/sharePhoto', { throws: new Error('Share Failed') });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('photo-input'), { target: { value: 'PhotoID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('share-button'));
  });

  expect(fetchMock.calls('/api/sharePhoto')).toHaveLength(1);
  expect(screen.getByTestId('share-failure')).toBeInTheDocument();
}, 10000);

test('Users can successfully remove tags from photos.', async () => {
  fetchMock.delete('/api/tags', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.queryByText('Nature')).not.toBeInTheDocument();
}, 10000);

test('Shows an error message when tag removal fails.', async () => {
  fetchMock.delete('/api/tags', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to remove tag')).toBeInTheDocument();
}, 10000);
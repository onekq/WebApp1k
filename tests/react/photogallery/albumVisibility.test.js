import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './albumVisibility';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Album Visibility Settings: success', async () => {
  fetchMock.post('/api/setAlbumVisibility', { body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('album-id-input'), { target: { value: 'AlbumID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('visibility-toggle-button'));
  });

  expect(fetchMock.calls('/api/setAlbumVisibility')).toHaveLength(1);
  expect(screen.getByTestId('visibility-success')).toBeInTheDocument();
}, 10000);

test('Album Visibility Settings: failure', async () => {
  fetchMock.post('/api/setAlbumVisibility', { throws: new Error('Visibility Change Failed') });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('album-id-input'), { target: { value: 'AlbumID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('visibility-toggle-button'));
  });

  expect(fetchMock.calls('/api/setAlbumVisibility')).toHaveLength(1);
  expect(screen.getByTestId('visibility-failure')).toBeInTheDocument();
}, 10000);


import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './sharePhoto';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Share Photo: success', async () => {
  fetchMock.post('/api/sharePhoto', { body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
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
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
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


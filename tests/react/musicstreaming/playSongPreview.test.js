import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import PreviewComponent from './playSongPreview';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Playing a preview of a song works.', async () => {
  fetchMock.post('/api/playPreview', 200);

  await act(async () => { render(<MemoryRouter><PreviewComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('play-preview-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('preview-playing')).toBeInTheDocument();
}, 10000);

test('Playing a preview of a song fails with an error message.', async () => {
  fetchMock.post('/api/playPreview', 500);

  await act(async () => { render(<MemoryRouter><PreviewComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('play-preview-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error playing preview')).toBeInTheDocument();
}, 10000);
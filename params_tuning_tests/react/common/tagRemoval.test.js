import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TagRemovalComponent from './tagRemoval';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Users can successfully remove tags from photos.', async () => {
  fetchMock.delete('/api/tags', { success: true });

  await act(async () => { render(<MemoryRouter><TagRemovalComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.queryByText('Nature')).not.toBeInTheDocument();
}, 10000);

test('Shows an error message when tag removal fails.', async () => {
  fetchMock.delete('/api/tags', { success: false });

  await act(async () => { render(<MemoryRouter><TagRemovalComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to remove tag')).toBeInTheDocument();
}, 10000);


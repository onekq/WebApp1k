import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import BatchPhotoDeleteComponent from './batchDeletePhotos';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('batch deletes multiple photos successfully', async () => {
  fetchMock.delete('/photos', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><BatchPhotoDeleteComponent /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-selected-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/photos deleted/i)).toBeInTheDocument();
}, 10000);

test('fails to batch delete multiple photos', async () => {
  fetchMock.delete('/photos', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><BatchPhotoDeleteComponent /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-selected-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/batch delete failed/i)).toBeInTheDocument();
}, 10000);


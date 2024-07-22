import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './unlikePhoto';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should successfully unlike a photo.', async () => {
  fetchMock.post('/api/photo/unlike', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('unlike-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('unlike-icon')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to unlike a photo.', async () => {
  fetchMock.post('/api/photo/unlike', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('unlike-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to unlike photo')).toBeInTheDocument();
}, 10000);


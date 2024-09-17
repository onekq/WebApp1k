import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteComment_photoVisibility';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should successfully delete a comment.', async () => {
  fetchMock.delete('/api/photo/deleteComment', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-comment-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.queryByTestId('comment-to-delete')).not.toBeInTheDocument();
}, 10000);

test('Should show error message when failing to delete a comment.', async () => {
  fetchMock.delete('/api/photo/deleteComment', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-comment-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to delete comment')).toBeInTheDocument();
}, 10000);

test('Photo Visibility Settings: success', async () => {
  fetchMock.post('/api/setPhotoVisibility', { body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('photo-id-input'), { target: { value: 'PhotoID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('visibility-toggle-button'));
  });

  expect(fetchMock.calls('/api/setPhotoVisibility')).toHaveLength(1);
  expect(screen.getByTestId('visibility-success')).toBeInTheDocument();
}, 10000);

test('Photo Visibility Settings: failure', async () => {
  fetchMock.post('/api/setPhotoVisibility', { throws: new Error('Visibility Change Failed') });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('photo-id-input'), { target: { value: 'PhotoID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('visibility-toggle-button'));
  });

  expect(fetchMock.calls('/api/setPhotoVisibility')).toHaveLength(1);
  expect(screen.getByTestId('visibility-failure')).toBeInTheDocument();
}, 10000);
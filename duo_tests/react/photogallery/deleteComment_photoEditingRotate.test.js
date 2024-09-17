import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteComment_photoEditingRotate';

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

test('should successfully rotate a photo', async () => {
  fetchMock.post('/api/rotate', { id: 1, rotated: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rotate-input'), { target: { value: '90' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rotate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Photo rotated')).toBeInTheDocument();
}, 10000);

test('should fail to rotate a photo with error message', async () => {
  fetchMock.post('/api/rotate', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rotate-input'), { target: { value: '90' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rotate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to rotate photo')).toBeInTheDocument();
}, 10000);
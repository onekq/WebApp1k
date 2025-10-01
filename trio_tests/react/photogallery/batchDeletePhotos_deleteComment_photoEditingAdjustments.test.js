import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './batchDeletePhotos_deleteComment_photoEditingAdjustments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('batch deletes multiple photos successfully', async () => {
  fetchMock.delete('/photos', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
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
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-selected-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/batch delete failed/i)).toBeInTheDocument();
}, 10000);

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

test('should successfully adjust photo settings', async () => {
  fetchMock.post('/api/adjustments', { id: 1, adjusted: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('adjustments-input'), { target: { value: 'brightness|10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('adjustments-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Photo adjusted')).toBeInTheDocument();
}, 10000);

test('should fail to adjust photo settings with error message', async () => {
  fetchMock.post('/api/adjustments', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('adjustments-input'), { target: { value: 'brightness|10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('adjustments-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to adjust photo')).toBeInTheDocument();
}, 10000);

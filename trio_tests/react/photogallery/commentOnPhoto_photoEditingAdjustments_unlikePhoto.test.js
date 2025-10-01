import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './commentOnPhoto_photoEditingAdjustments_unlikePhoto';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Should successfully add a comment on a photo.', async () => {
  fetchMock.post('/api/photo/comment', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Nice photo!' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('comment-submit'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('comment-Nice photo!')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to add a comment.', async () => {
  fetchMock.post('/api/photo/comment', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Nice photo!' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('comment-submit'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to add comment')).toBeInTheDocument();
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

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editComment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should successfully edit a comment.', async () => {
  fetchMock.put('/api/photo/editComment', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('edit-comment-input'), { target: { value: 'Edited comment!' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('edit-comment-submit'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('comment-Edited comment!')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to edit a comment.', async () => {
  fetchMock.put('/api/photo/editComment', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('edit-comment-input'), { target: { value: 'Edited comment!' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('edit-comment-submit'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to edit comment')).toBeInTheDocument();
}, 10000);


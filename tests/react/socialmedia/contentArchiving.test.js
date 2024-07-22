import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import PostComponent from './contentArchiving';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully archives a post.', async () => {
  fetchMock.post('/api/archive', {
    status: 200, body: { message: 'Post archived' }
  });

  await act(async () => {
    render(<MemoryRouter><PostComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Archive'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post archived')).toBeInTheDocument();
}, 10000);

test('Shows error message when archiving a post fails.', async () => {
  fetchMock.post('/api/archive', {
    status: 500, body: { message: 'Failed to archive post' }
  });

  await act(async () => {
    render(<MemoryRouter><PostComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Archive'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to archive post')).toBeInTheDocument();
}, 10000);


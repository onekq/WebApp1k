import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contentSearch_coverPhotoUpdate_profileViewing';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully searches and displays posts.', async () => {
  fetchMock.post('/api/search', {
    status: 200, body: [{ id: 1, content: 'Search result' }]
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'test' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Search'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Search result')).toBeInTheDocument();
}, 10000);

test('Shows error message for invalid search query.', async () => {
  fetchMock.post('/api/search', {
    status: 400, body: { message: 'Invalid search query' }
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Search'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid search query')).toBeInTheDocument();
}, 10000);

test('Cover photo update succeeds with valid image', async () => {
  fetchMock.put('/api/profile/cover-photo', { body: { message: 'Cover photo updated' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cover-photo'), { target: { files: [new File([], 'cover.jpg', { type: 'image/jpeg' })] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Cover Photo')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Cover photo updated')).toBeInTheDocument();
}, 10000);

test('Cover photo update fails with invalid image', async () => {
  fetchMock.put('/api/profile/cover-photo', { body: { error: 'Invalid image format' }, status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cover-photo'), { target: { files: [new File([], 'cover.txt', { type: 'text/plain' })] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Cover Photo')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid image format')).toBeInTheDocument();
}, 10000);

test('Profile viewing succeeds for existing profile', async () => {
  fetchMock.get('/api/profile/1', { body: { name: 'John Doe' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App profileId={1} /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
}, 10000);

test('Profile viewing fails for non-existent profile', async () => {
  fetchMock.get('/api/profile/999', { body: { error: 'Profile not found' }, status: 404 });

  await act(async () => { render(<MemoryRouter><App profileId={999} /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile not found')).toBeInTheDocument();
}, 10000);

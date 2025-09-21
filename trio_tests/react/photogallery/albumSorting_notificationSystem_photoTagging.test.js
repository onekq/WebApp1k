import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './albumSorting_notificationSystem_photoTagging';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Album Sorting: success', async () => {
  fetchMock.get('/api/albums?sortBy=date', { body: [{ id: 1, name: 'Album1' }] });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('sort-select'), { target: { value: 'date' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('sort-button'));
  });

  expect(fetchMock.calls('/api/albums?sortBy=date')).toHaveLength(1);
  expect(screen.getByTestId('album-1')).toBeInTheDocument();
}, 10000);

test('Album Sorting: failure', async () => {
  fetchMock.get('/api/albums?sortBy=date', { throws: new Error('Sort Failed') });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('sort-select'), { target: { value: 'date' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('sort-button'));
  });

  expect(fetchMock.calls('/api/albums?sortBy=date')).toHaveLength(1);
  expect(screen.getByTestId('sort-failure')).toBeInTheDocument();
}, 10000);

test('Should successfully notify user of a new comment.', async () => {
  fetchMock.get('/api/notifications', { status: 200, body: { notifications: ['New comment on your photo!'] } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('notifications-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('New comment on your photo!')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to fetch notifications.', async () => {
  fetchMock.get('/api/notifications', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('notifications-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load notifications')).toBeInTheDocument();
}, 10000);

test('Users can successfully add tags to photos.', async () => {
  fetchMock.post('/api/tags', { success: true });

  await act(async () => { render(<MemoryRouter><PhotoTaggingComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input'), { target: { value: 'Nature' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Nature')).toBeInTheDocument();
}, 10000);

test('Shows an error message when tag addition fails.', async () => {
  fetchMock.post('/api/tags', { success: false });

  await act(async () => { render(<MemoryRouter><PhotoTaggingComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input'), { target: { value: 'Nature' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to add tag')).toBeInTheDocument();
}, 10000);

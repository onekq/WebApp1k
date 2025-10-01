import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './albumVisibility_notificationSystem_unfavoritePhoto';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Album Visibility Settings: success', async () => {
  fetchMock.post('/api/setAlbumVisibility', { body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('album-id-input'), { target: { value: 'AlbumID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('visibility-toggle-button'));
  });

  expect(fetchMock.calls('/api/setAlbumVisibility')).toHaveLength(1);
  expect(screen.getByTestId('visibility-success')).toBeInTheDocument();
}, 10000);

test('Album Visibility Settings: failure', async () => {
  fetchMock.post('/api/setAlbumVisibility', { throws: new Error('Visibility Change Failed') });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('album-id-input'), { target: { value: 'AlbumID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('visibility-toggle-button'));
  });

  expect(fetchMock.calls('/api/setAlbumVisibility')).toHaveLength(1);
  expect(screen.getByTestId('visibility-failure')).toBeInTheDocument();
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

test('Should successfully unmark a photo as favorite.', async () => {
  fetchMock.post('/api/photo/unfavorite', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('unfavorite-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('unfavorite-icon')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to unmark a photo as favorite.', async () => {
  fetchMock.post('/api/photo/unfavorite', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('unfavorite-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to unfavorite photo')).toBeInTheDocument();
}, 10000);

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './forumReplyNotification_watchVideo';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully sends a forum reply notification', async () => {
  fetchMock.post('/forum/reply-notifications', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Reply')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Notification sent')).toBeInTheDocument();
}, 10000);

test('Fails to send a forum reply notification', async () => {
  fetchMock.post('/forum/reply-notifications', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Reply')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Notification failed')).toBeInTheDocument();
}, 10000);

test('Success: video plays successfully', async () => {
  fetchMock.get('/api/video', 200);
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('play-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('video-player')).toBeInTheDocument();
}, 10000);

test('Failure: video fails to play', async () => {
  fetchMock.get('/api/video', 500);
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('play-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error playing video')).toBeInTheDocument();
}, 10000);
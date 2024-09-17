import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './notificationForNewFollowers_postDraftEditing';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should send a notification when a user gains a new follower', async () => {
  fetchMock.post('/api/follow', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('follow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a new follower', async () => {
  fetchMock.post('/api/follow', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('follow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Test editing saved drafts.', async () => {
  fetchMock.put('/api/posts/draft/1', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByText('Edit Draft'), { target: { value: 'Updated draft content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft updated successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure changes are saved and displayed (draft).', async () => {
  fetchMock.put('/api/posts/draft/1', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByText('Edit Draft'), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update draft.')).toBeInTheDocument();
}, 10000);
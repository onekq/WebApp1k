import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './notificationAppUpdate_postDraftDeletion';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should update notification settings', async () => {
  fetchMock.post('/api/notification/settings', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('settings-input'), {target: {value: 'new-settings'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-settings-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('should handle error when updating notification settings fails', async () => {
  fetchMock.post('/api/notification/settings', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('settings-input'), {target: {value: 'new-settings'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-settings-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Verify deletion of saved drafts.', async () => {
  fetchMock.delete('/api/posts/draft/1', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Delete Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft deleted successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure error handling for non-existent draft deletion.', async () => {
  fetchMock.delete('/api/posts/draft/1', 404);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Delete Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft not found.')).toBeInTheDocument();
}, 10000);
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './postEditing_privacySettingsUpdate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Test updating an existing post.', async () => {
  fetchMock.put('/api/posts/1', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByText('Edit'), { target: { value: 'New content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post updated successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure changes are saved and displayed.', async () => {
  fetchMock.put('/api/posts/1', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByText('Edit'), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update the post.')).toBeInTheDocument();
}, 10000);

test('Privacy settings update succeeds', async () => {
  fetchMock.put('/api/profile/privacy-settings', { body: { message: 'Privacy settings updated' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('privacy-setting'), { target: { value: 'private' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Settings')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Privacy settings updated')).toBeInTheDocument();
}, 10000);

test('Privacy settings update fails', async () => {
  fetchMock.put('/api/profile/privacy-settings', { body: { error: 'Failed to update settings' }, status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('privacy-setting'), { target: { value: 'invalid' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Settings')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to update settings')).toBeInTheDocument();
}, 10000);
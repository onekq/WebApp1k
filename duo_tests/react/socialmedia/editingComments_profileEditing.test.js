import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editingComments_profileEditing';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should update an existing comment', async () => {
  fetchMock.put('api/comment', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('edit-comment-input'), { target: { value: 'Updated comment' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when updating a comment with invalid data', async () => {
  fetchMock.put('api/comment', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('edit-comment-input'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Profile editing succeeds with valid changes', async () => {
  fetchMock.put('/api/profile', { body: { message: 'Profile updated' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-name'), { target: { value: 'John Updated' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Changes')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile updated')).toBeInTheDocument();
}, 10000);

test('Profile editing fails with invalid changes', async () => {
  fetchMock.put('/api/profile', { body: { error: 'Invalid changes' }, status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-name'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Changes')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid changes')).toBeInTheDocument();
}, 10000);
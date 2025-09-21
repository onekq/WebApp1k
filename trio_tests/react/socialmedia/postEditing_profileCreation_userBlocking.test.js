import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './postEditing_profileCreation_userBlocking';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Test updating an existing post.', async () => {
  fetchMock.put('/api/posts/1', 200);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
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
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
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

test('Profile creation succeeds with valid inputs', async () => {
  fetchMock.post('/api/profile', { body: { message: 'Profile created' }, status: 201 });

  await act(async () => { render(<MemoryRouter><ProfileCreationForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-name'), { target: { value: 'John Doe' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Profile')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile created')).toBeInTheDocument();
}, 10000);

test('Profile creation fails with invalid inputs', async () => {
  fetchMock.post('/api/profile', { body: { error: 'Invalid profile inputs' }, status: 400 });

  await act(async () => { render(<MemoryRouter><ProfileCreationForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-name'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Profile')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid profile inputs')).toBeInTheDocument();
}, 10000);

test('User blocking succeeds for valid user', async () => {
  fetchMock.post('/api/profile/block', { body: { message: 'User blocked' }, status: 200 });

  await act(async () => { render(<MemoryRouter><BlockUser userId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Block User')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('User blocked')).toBeInTheDocument();
}, 10000);

test('User blocking fails for invalid user', async () => {
  fetchMock.post('/api/profile/block', { body: { error: 'Invalid user' }, status: 400 });

  await act(async () => { render(<MemoryRouter><BlockUser userId={9999} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Block User')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid user')).toBeInTheDocument();
}, 10000);

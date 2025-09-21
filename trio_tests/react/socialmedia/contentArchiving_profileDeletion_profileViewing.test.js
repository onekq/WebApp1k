import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contentArchiving_profileDeletion_profileViewing';

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

test('Profile deletion succeeds for valid profile', async () => {
  fetchMock.delete('/api/profile/1', { body: { message: 'Profile deleted' }, status: 200 });

  await act(async () => { render(<MemoryRouter><ProfileDeletion profileId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Profile')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile deleted')).toBeInTheDocument();
}, 10000);

test('Profile deletion fails for non-existent profile', async () => {
  fetchMock.delete('/api/profile/9999', { body: { error: 'Profile not found' }, status: 404 });

  await act(async () => { render(<MemoryRouter><ProfileDeletion profileId={9999} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Profile')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile not found')).toBeInTheDocument();
}, 10000);

test('Profile viewing succeeds for existing profile', async () => {
  fetchMock.get('/api/profile/1', { body: { name: 'John Doe' }, status: 200 });

  await act(async () => { render(<MemoryRouter><ProfileView profileId={1} /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
}, 10000);

test('Profile viewing fails for non-existent profile', async () => {
  fetchMock.get('/api/profile/999', { body: { error: 'Profile not found' }, status: 404 });

  await act(async () => { render(<MemoryRouter><ProfileView profileId={999} /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile not found')).toBeInTheDocument();
}, 10000);

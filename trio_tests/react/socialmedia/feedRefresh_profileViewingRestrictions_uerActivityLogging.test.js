import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './feedRefresh_profileViewingRestrictions_uerActivityLogging';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully refreshes feed to show new posts.', async () => {
  fetchMock.get('/api/feed', {
    status: 200, body: [{ id: 1, content: 'New post' }]
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Refresh'));
  });

  expect(fetchMock.calls()).toHaveLength(2);
  expect(screen.getByText('New post')).toBeInTheDocument();
}, 10000);

test('Shows error message when feed refresh fails.', async () => {
  fetchMock.get('/api/feed', {
    status: 500, body: { message: 'Failed to refresh feed' }
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Refresh'));
  });

  expect(fetchMock.calls()).toHaveLength(2);
  expect(screen.getByText('Failed to refresh feed')).toBeInTheDocument();
}, 10000);

test('Viewing restricted profile succeeds with proper data', async () => {
  const profileData = { name: 'John Doe', bio: 'Software Developer' };
  fetchMock.get('/api/profile/valid-id', { body: profileData, status: 200 });

  await act(async () => { render(<MemoryRouter><App profileId={'valid-id'} /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('Software Developer')).toBeInTheDocument();
}, 10000);

test('Viewing restricted profile fails with proper message', async () => {
  fetchMock.get('/api/profile/restricted-id', { body: { error: 'Profile is private' }, status: 403 });

  await act(async () => { render(<MemoryRouter><App profileId={'restricted-id'} /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile is private')).toBeInTheDocument();
}, 10000);

test('Successfully logs user activities.', async () => {
  fetchMock.post('/api/log', {
    status: 200, body: { message: 'Activity logged' }
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Like'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Activity logged')).toBeInTheDocument();
}, 10000);

test('Shows error message when logging user activities fails.', async () => {
  fetchMock.post('/api/log', {
    status: 500, body: { message: 'Failed to log activity' }
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Like'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log activity')).toBeInTheDocument();
}, 10000);

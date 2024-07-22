import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ProfileDeletion from './profileDeletion';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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
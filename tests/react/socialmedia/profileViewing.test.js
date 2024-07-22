import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ProfileView from './profileViewing';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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


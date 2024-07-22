import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ProfileVisibility from './profileVisibilityControl';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('job seekers can successfully control the visibility of their profiles', async () => {
  fetchMock.post('/api/jobseeker/visibility', { success: true });

  await act(async () => { render(<MemoryRouter><ProfileVisibility /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Make Profile Public/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile visibility updated')).toBeInTheDocument();
}, 10000);

test('job seekers see an error message if visibility control fails', async () => {
  fetchMock.post('/api/jobseeker/visibility', 500);

  await act(async () => { render(<MemoryRouter><ProfileVisibility /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Make Profile Public/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to update profile visibility')).toBeInTheDocument();
}, 10000);


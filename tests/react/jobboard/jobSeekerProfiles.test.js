import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import JobSeekerProfile from './jobSeekerProfiles';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('job seekers can successfully create and update their profiles', async () => {
  fetchMock.post('/api/jobseeker', { success: true });

  await act(async () => { render(<MemoryRouter><JobSeekerProfile /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Save/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
}, 10000);

test('job seekers see an error message if profile update fails', async () => {
  fetchMock.post('/api/jobseeker', 500);

  await act(async () => { render(<MemoryRouter><JobSeekerProfile /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Save/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to update profile')).toBeInTheDocument();
}, 10000);


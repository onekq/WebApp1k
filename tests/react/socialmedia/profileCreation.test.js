import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ProfileCreationForm from './profileCreation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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


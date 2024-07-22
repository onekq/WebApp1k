import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import UserProfileComponent from './multipleUserProfiles';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Multiple user profiles should be managed successfully.', async () => {
  fetchMock.get('/api/user/profiles', [{ id: 1, name: 'John Doe' }]);

  await act(async () => { render(<MemoryRouter><UserProfileComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('get-profiles')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('profiles-list')).toBeInTheDocument();
}, 10000);

test('Error in managing user profiles should show error message.', async () => {
  fetchMock.get('/api/user/profiles', 404);

  await act(async () => { render(<MemoryRouter><UserProfileComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('get-profiles')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('profiles-error')).toBeInTheDocument();
}, 10000);


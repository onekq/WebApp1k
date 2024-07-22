import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SocialMediaApp from './unfollowingUsers';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should unfollow a followed user', async () => {
  fetchMock.post('api/unfollow', { status: 200 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-input'), { target: { value: 'followedUser' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Unfollow')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when trying to unfollow a user not followed', async () => {
  fetchMock.post('api/unfollow', { status: 404 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-input'), { target: { value: 'unfollowedUser' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Unfollow')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);


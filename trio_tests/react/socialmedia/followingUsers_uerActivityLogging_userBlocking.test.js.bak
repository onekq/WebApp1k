import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './followingUsers_uerActivityLogging_userBlocking';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Should follow a valid user', async () => {
  fetchMock.post('api/follow', { status: 200 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-input'), { target: { value: 'validUser' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Follow')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when trying to follow an invalid user', async () => {
  fetchMock.post('api/follow', { status: 404 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-input'), { target: { value: 'invalidUser' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Follow')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Successfully logs user activities.', async () => {
  fetchMock.post('/api/log', {
    status: 200, body: { message: 'Activity logged' }
  });

  await act(async () => {
    render(<MemoryRouter><ActivityLogger /></MemoryRouter>);
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
    render(<MemoryRouter><ActivityLogger /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Like'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log activity')).toBeInTheDocument();
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

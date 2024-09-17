import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './taggingUsersInComments_userBlocking';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should tag a valid user in a comment', async () => {
  fetchMock.post('api/tag', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input-comment'), { target: { value: 'userToTag' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Tag')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when tagging an invalid user in a comment', async () => {
  fetchMock.post('api/tag', { status: 404 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input-comment'), { target: { value: 'invalidUser' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Tag')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('User blocking succeeds for valid user', async () => {
  fetchMock.post('/api/profile/block', { body: { message: 'User blocked' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App userId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Block User')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('User blocked')).toBeInTheDocument();
}, 10000);

test('User blocking fails for invalid user', async () => {
  fetchMock.post('/api/profile/block', { body: { error: 'Invalid user' }, status: 400 });

  await act(async () => { render(<MemoryRouter><App userId={9999} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Block User')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid user')).toBeInTheDocument();
}, 10000);
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SocialMediaApp from './unlikingPosts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should unlike a liked post', async () => {
  fetchMock.post('api/unlike', { status: 200 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unlike-button-post1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when unliking a post not liked', async () => {
  fetchMock.post('api/unlike', { status: 404 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unlike-button-invalid')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);


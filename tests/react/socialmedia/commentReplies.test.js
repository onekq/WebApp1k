import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SocialMediaApp from './commentReplies';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should reply to an existing comment', async () => {
  fetchMock.post('api/reply', { status: 200 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('reply-input'), { target: { value: 'Nice comment!' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Reply')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when replying to an invalid comment', async () => {
  fetchMock.post('api/reply', { status: 404 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('reply-input'), { target: { value: 'Nice comment!' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Reply')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);


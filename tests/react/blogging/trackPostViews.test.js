import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TrackPostViews from './trackPostViews';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully tracks post views', async () => {
  fetchMock.post('/api/trackPostViews', { status: 200 });

  await act(async () => { render(<MemoryRouter><TrackPostViews postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Post')); });

  expect(fetchMock.calls('/api/trackPostViews')).toHaveLength(1);
  expect(fetchMock.calls('/api/trackPostViews')[0][1].body).toContain('"postId":"1"');
  expect(screen.getByText('Views: 1')).toBeInTheDocument();
}, 10000);

test('fails to track post views with an error message', async () => {
  fetchMock.post('/api/trackPostViews', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><TrackPostViews postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Post')); });

  expect(fetchMock.calls('/api/trackPostViews')).toHaveLength(1);
  expect(screen.getByText('Error tracking views')).toBeInTheDocument();
}, 10000);


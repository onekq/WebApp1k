import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TrackPostShares from './trackPostShares';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully tracks post shares on social media', async () => {
  fetchMock.post('/api/trackPostShares', { status: 200 });

  await act(async () => { render(<MemoryRouter><TrackPostShares postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share Post')); });

  expect(fetchMock.calls('/api/trackPostShares')).toHaveLength(1);
  expect(fetchMock.calls('/api/trackPostShares')[0][1].body).toContain('"postId":"1"');
  expect(screen.getByText('Shares: 1')).toBeInTheDocument();
}, 10000);

test('fails to track post shares with an error message', async () => {
  fetchMock.post('/api/trackPostShares', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><TrackPostShares postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share Post')); });

  expect(fetchMock.calls('/api/trackPostShares')).toHaveLength(1);
  expect(screen.getByText('Error tracking shares')).toBeInTheDocument();
}, 10000);


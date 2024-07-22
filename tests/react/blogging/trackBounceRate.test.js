import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TrackBounceRate from './trackBounceRate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully tracks bounce rate', async () => {
  fetchMock.post('/api/trackBounceRate', { status: 200 });

  await act(async () => { render(<MemoryRouter><TrackBounceRate postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Track Bounce Rate')); });

  expect(fetchMock.calls('/api/trackBounceRate')).toHaveLength(1);
  expect(screen.getByText('Bounce Rate: 50%')).toBeInTheDocument();
}, 10000);

test('fails to track bounce rate with an error message', async () => {
  fetchMock.post('/api/trackBounceRate', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><TrackBounceRate postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Track Bounce Rate')); });

  expect(fetchMock.calls('/api/trackBounceRate')).toHaveLength(1);
  expect(screen.getByText('Error tracking bounce rate')).toBeInTheDocument();
}, 10000);
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './winningBidNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully notifies user of winning bid.', async () => {
  fetchMock.get('/api/winning-bid', { status: 200, body: { message: 'You have won the bid!' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-winning-bid')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('You have won the bid!')).toBeInTheDocument();
}, 10000);

test('fails to notify user of winning bid with an error message.', async () => {
  fetchMock.get('/api/winning-bid', { status: 400, body: { error: 'No winning bid' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-winning-bid')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No winning bid')).toBeInTheDocument();
}, 10000);


import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './awardBadgesForMilestones';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('System awards badges for milestones achieved successfully.', async () => {
  fetchMock.get('/api/award-badges', { badge: '100 miles run' });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('award-badge')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/100 miles run/)).toBeInTheDocument();
}, 10000);

test('System fails to award badges for milestones achieved.', async () => {
  fetchMock.get('/api/award-badges', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('award-badge')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error awarding badges/)).toBeInTheDocument();
}, 10000);


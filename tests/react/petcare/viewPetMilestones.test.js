import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Community from './viewPetMilestones';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully views pet milestones', async () => {
  fetchMock.get('/api/milestones/view', { status: 200, body: [{ id: 1, description: 'First birthday' }] });

  await act(async () => { render(<MemoryRouter><Community /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('First birthday')).toBeInTheDocument();
}, 10000);

test('Fails to view pet milestones', async () => {
  fetchMock.get('/api/milestones/view', { status: 500 });

  await act(async () => { render(<MemoryRouter><Community /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch milestones')).toBeInTheDocument();
}, 10000);


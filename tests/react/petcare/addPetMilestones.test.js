import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Community from './addPetMilestones';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully adds a new pet milestone', async () => {
  fetchMock.post('/api/milestones/add', { status: 200 });

  await act(async () => { render(<MemoryRouter><Community /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('milestone-input'), { target: { value: 'Learned to Sit' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-milestone-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Milestone added successfully')).toBeInTheDocument();
}, 10000);

test('Fails to add new pet milestone', async () => {
  fetchMock.post('/api/milestones/add', { status: 400 });

  await act(async () => { render(<MemoryRouter><Community /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-milestone-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to add milestone')).toBeInTheDocument();
}, 10000);


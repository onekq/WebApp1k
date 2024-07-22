import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Community from './deletePetMilestones';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully deletes a pet milestone', async () => {
  fetchMock.delete('/api/milestones/delete', { status: 200 });

  await act(async () => { render(<MemoryRouter><Community /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-milestone-button', { name: /delete/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Milestone deleted successfully')).toBeInTheDocument();
}, 10000);

test('Fails to delete a pet milestone', async () => {
  fetchMock.delete('/api/milestones/delete', { status: 500 });

  await act(async () => {	render(<MemoryRouter><Community /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-milestone-button', { name: /delete/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to delete milestone')).toBeInTheDocument();
}, 10000);


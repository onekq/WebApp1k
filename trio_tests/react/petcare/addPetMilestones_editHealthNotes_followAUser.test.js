import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addPetMilestones_editHealthNotes_followAUser';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully adds a new pet milestone', async () => {
  fetchMock.post('/api/milestones/add', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('milestone-input'), { target: { value: 'Learned to Sit' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-milestone-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Milestone added successfully')).toBeInTheDocument();
}, 10000);

test('Fails to add new pet milestone', async () => {
  fetchMock.post('/api/milestones/add', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-milestone-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to add milestone')).toBeInTheDocument();
}, 10000);

test('Edit health notes successfully', async () => {
  fetchMock.put('/api/health-notes/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('notes-input'), { target: { value: 'Very healthy!' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-notes/1').length).toBe(1);
  expect(screen.getByText('Health notes updated')).toBeInTheDocument();
}, 10000);

test('Fail to edit health notes with error', async () => {
  fetchMock.put('/api/health-notes/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('notes-input'), { target: { value: '' } }); }); // Failure case: Empty input
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-notes/1').length).toBe(1);
  expect(screen.getByText('Failed to update health notes')).toBeInTheDocument(); // Error message
}, 10000);

test('Successfully follows a user', async () => {
  fetchMock.post('/api/users/follow', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('follow-button', { name: /follow/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Followed successfully')).toBeInTheDocument();
}, 10000);

test('Fails to follow a user', async () => {
  fetchMock.post('/api/users/follow', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('follow-button', { name: /follow/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to follow user')).toBeInTheDocument();
}, 10000);

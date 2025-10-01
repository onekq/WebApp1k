import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editPetMilestones_likeCommunityUpdates_searchActivityLogs';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully edits a pet milestone', async () => {
  fetchMock.put('/api/milestones/edit', { status: 200 });

  await act(async () => { render(<MemoryRouter><Community /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('edit-milestone-button', { name: /edit/i })); });
  await act(async () => { fireEvent.change(screen.getByTestId('milestone-input'), { target: { value: 'Learned to Fetch' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-milestone-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Milestone updated successfully')).toBeInTheDocument();
}, 10000);

test('Fails to edit a pet milestone', async () => {
  fetchMock.put('/api/milestones/edit', { status: 400 });

  await act(async () => { render(<MemoryRouter><Community /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('edit-milestone-button', { name: /edit/i })); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-milestone-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update milestone')).toBeInTheDocument();
}, 10000);

test('Successfully likes a community update', async () => {
  fetchMock.post('/api/community/like', { status: 200 });

  await act(async () => { render(<MemoryRouter><Community /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('like-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Liked')).toBeInTheDocument();
}, 10000);

test('Fails to like a community update', async () => {
  fetchMock.post('/api/community/like', { status: 500 });

  await act(async () => { render(<MemoryRouter><Community /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('like-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to like update')).toBeInTheDocument();
}, 10000);

test('Searches activities by keyword successfully.', async () => {
  fetchMock.get('/activities?keyword=walk', [{ description: 'Morning walk' }]);

  await act(async () => { render(<MemoryRouter><SearchActivityLogs /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'walk' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls('/activities?keyword=walk').length).toBe(1);
  expect(screen.getByText('Morning walk')).toBeInTheDocument();
}, 10000);

test('Fails to search activities with error message.', async () => {
  fetchMock.get('/activities?keyword=walk', { status: 500, body: { message: 'Failed to search activities' } });

  await act(async () => { render(<MemoryRouter><SearchActivityLogs /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'walk' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls('/activities?keyword=walk').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

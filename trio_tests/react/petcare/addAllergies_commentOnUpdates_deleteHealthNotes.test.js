import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addAllergies_commentOnUpdates_deleteHealthNotes';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Add allergies successfully.', async () => {
  fetchMock.post('/api/allergies', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/allergy/i), {target: {value: 'Peanuts'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Allergy/i)); });

  expect(fetchMock.calls('/api/allergies').length).toBe(1);
  expect(screen.getByText('Allergy added successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to add allergies due to missing allergy name.', async () => {
  fetchMock.post('/api/allergies', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/allergy/i), {target: {value: ''}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Allergy/i)); });

  expect(fetchMock.calls('/api/allergies').length).toBe(1);
  expect(screen.getByText('Allergy name is required.')).toBeInTheDocument();
}, 10000);

test('Successfully comments on a community update', async () => {
  fetchMock.post('/api/community/comment', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Nice update!' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Comment added successfully')).toBeInTheDocument();
}, 10000);

test('Fails to comment on a community update', async () => {
  fetchMock.post('/api/community/comment', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to add comment')).toBeInTheDocument();
}, 10000);

test('Delete health notes successfully', async () => {
  fetchMock.delete('/api/health-notes/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/api/health-notes/1').length).toBe(1);
  expect(screen.getByText('Health notes deleted')).toBeInTheDocument();
}, 10000);

test('Fail to delete health notes with error', async () => {
  fetchMock.delete('/api/health-notes/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-button')); });

  expect(fetchMock.calls('/api/health-notes/1').length).toBe(1);
  expect(screen.getByText('Failed to delete health notes')).toBeInTheDocument(); // Error message
}, 10000);

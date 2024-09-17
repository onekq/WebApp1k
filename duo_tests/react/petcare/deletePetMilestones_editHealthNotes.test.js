import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deletePetMilestones_editHealthNotes';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully deletes a pet milestone', async () => {
  fetchMock.delete('/api/milestones/delete', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-milestone-button', { name: /delete/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Milestone deleted successfully')).toBeInTheDocument();
}, 10000);

test('Fails to delete a pet milestone', async () => {
  fetchMock.delete('/api/milestones/delete', { status: 500 });

  await act(async () => {	render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-milestone-button', { name: /delete/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to delete milestone')).toBeInTheDocument();
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
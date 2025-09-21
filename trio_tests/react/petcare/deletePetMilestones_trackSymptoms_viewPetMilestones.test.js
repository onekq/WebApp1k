import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deletePetMilestones_trackSymptoms_viewPetMilestones';

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

test('Log and track symptoms successfully', async () => {
  fetchMock.post('/api/symptoms', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('symptoms-input'), { target: { value: 'Coughing' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/symptoms').length).toBe(1);
  expect(screen.getByText('Symptoms logged successfully')).toBeInTheDocument();
}, 10000);

test('Fail to log and track symptoms with error', async () => {
  fetchMock.post('/api/symptoms', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('symptoms-input'), { target: { value: '' } }); }); // Failure case: Empty input
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/symptoms').length).toBe(1);
  expect(screen.getByText('Failed to log symptoms')).toBeInTheDocument(); // Error message
}, 10000);

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

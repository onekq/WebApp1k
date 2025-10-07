import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addHealthNotes_viewUpcomingReminders_followAUser_shareUpdates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Add health notes successfully (from addHealthNotes_viewUpcomingReminders)', async () => {
  fetchMock.post('/api/health-notes', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('notes-input'), { target: { value: 'Healthy!' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-notes').length).toBe(1);
  expect(screen.getByText('Health notes added')).toBeInTheDocument();
}, 10000);

test('Fail to add health notes with error (from addHealthNotes_viewUpcomingReminders)', async () => {
  fetchMock.post('/api/health-notes', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('notes-input'), { target: { value: '' } }); }); // Failure case: Empty input
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-notes').length).toBe(1);
  expect(screen.getByText('Failed to add health notes')).toBeInTheDocument(); // Error message
}, 10000);

test('should load upcoming reminders successfully (from addHealthNotes_viewUpcomingReminders)', async () => {
  fetchMock.get('/api/upcoming-reminders', {
    reminders: [
      { id: 1, type: 'Medication', description: 'Antibiotics' },
      { id: 2, type: 'Appointment', description: 'Vet visit' }
    ]
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Antibiotics/i)).toBeInTheDocument();
  expect(screen.getByText(/Vet visit/i)).toBeInTheDocument();
}, 10000);

test('should fail to load upcoming reminders (from addHealthNotes_viewUpcomingReminders)', async () => {
  fetchMock.get('/api/upcoming-reminders', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Failed to load reminders/i)).toBeInTheDocument();
}, 10000);

test('Successfully follows a user (from followAUser_shareUpdates)', async () => {
  fetchMock.post('/api/users/follow', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('follow-button', { name: /follow/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Followed successfully')).toBeInTheDocument();
}, 10000);

test('Fails to follow a user (from followAUser_shareUpdates)', async () => {
  fetchMock.post('/api/users/follow', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('follow-button', { name: /follow/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to follow user')).toBeInTheDocument();
}, 10000);

test('Successfully shares updates with the community (from followAUser_shareUpdates)', async () => {
  fetchMock.post('/api/community/share', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('update-input'), { target: { value: 'New update' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Update shared successfully')).toBeInTheDocument();
}, 10000);

test('Fails to share updates without input (from followAUser_shareUpdates)', async () => {
  fetchMock.post('/api/community/share', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to share update')).toBeInTheDocument();
}, 10000);


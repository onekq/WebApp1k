import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteAppointmentReminder_deleteVaccinationRecord_likeCommunityUpdates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should delete an appointment reminder successfully', async () => {
  fetchMock.delete('/api/delete-appointment-reminder', 200);

  await act(async () => {
    render(<MemoryRouter><RemindersComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Delete Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Reminder deleted successfully/i)).toBeInTheDocument();
}, 10000);

test('should fail to delete an appointment reminder', async () => {
  fetchMock.delete('/api/delete-appointment-reminder', 500);

  await act(async () => {
    render(<MemoryRouter><RemindersComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Delete Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Failed to delete reminder/i)).toBeInTheDocument();
}, 10000);

test('Delete vaccination record successfully.', async () => {
  fetchMock.delete('/api/vaccinations/1', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete Vaccination/i)); });

  expect(fetchMock.calls('/api/vaccinations/1').length).toBe(1);
  expect(screen.getByText('Vaccination record deleted successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to delete vaccination record due to server error.', async () => {
  fetchMock.delete('/api/vaccinations/1', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete Vaccination/i)); });

  expect(fetchMock.calls('/api/vaccinations/1').length).toBe(1);
  expect(screen.getByText('Failed to delete vaccination record.')).toBeInTheDocument();
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

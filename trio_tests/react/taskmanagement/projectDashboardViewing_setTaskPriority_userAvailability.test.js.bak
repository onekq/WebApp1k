import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './projectDashboardViewing_setTaskPriority_userAvailability';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('View Project Dashboard - success', async () => {
  fetchMock.get('/api/projects/dashboard', 200);

  await act(async () => {
    render(<MemoryRouter><ProjectManagementApp /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /view dashboard/i }));
  });

  expect(fetchMock.calls('/api/projects/dashboard')).toHaveLength(1);
  expect(screen.getByText(/project dashboard/i)).toBeInTheDocument();
}, 10000);

test('View Project Dashboard - failure', async () => {
  fetchMock.get('/api/projects/dashboard', 400);

  await act(async () => {
    render(<MemoryRouter><ProjectManagementApp /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /view dashboard/i }));
  });

  expect(fetchMock.calls('/api/projects/dashboard')).toHaveLength(1);
  expect(screen.getByText(/failed to load dashboard/i)).toBeInTheDocument();
}, 10000);

test('should set task priority successfully.', async () => {
  fetchMock.post('/api/setPriority', { status: 200, body: { taskId: 1, priority: 'High' }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('priority-select'), { target: { value: 'High' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Set Priority')); });

  expect(fetchMock.calls('/api/setPriority')).toHaveLength(1);
  expect(screen.getByText('Task priority updated!')).toBeInTheDocument();
}, 10000);

test('should display error when setting task priority fails.', async () => {
  fetchMock.post('/api/setPriority', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('priority-select'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Set Priority')); });

  expect(fetchMock.calls('/api/setPriority')).toHaveLength(1);
  expect(screen.getByText('Failed to set task priority.')).toBeInTheDocument();
}, 10000);

test('Set user availability successfully', async () => {
  fetchMock.post('/set-availability', { status: 200, body: { available: true } });

  await act(async () => { render(<MemoryRouter><TaskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('availability-toggle')); });

  expect(fetchMock.calls('/set-availability').length).toBe(1);
  expect(screen.getByText('Availability set successfully')).toBeInTheDocument();
}, 10000);

test('Fail to set user availability due to server error', async () => {
  fetchMock.post('/set-availability', { status: 500, body: { available: false } });

  await act(async () => { render(<MemoryRouter><TaskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('availability-toggle')); });

  expect(fetchMock.calls('/set-availability').length).toBe(1);
  expect(screen.getByText('Error setting availability')).toBeInTheDocument();
}, 10000);

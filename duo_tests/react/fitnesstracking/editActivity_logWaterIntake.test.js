import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editActivity_logWaterIntake';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can edit an existing fitness activity successfully.', async () => {
  fetchMock.put('/api/editActivity', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-name'), { target: { value: 'Updated Running' } });
    fireEvent.click(screen.getByTestId('submit-edit'));
  });

  expect(fetchMock.called('/api/editActivity')).toBeTruthy();
  expect(screen.getByText('Activity updated successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when editing a fitness activity fails.', async () => {
  fetchMock.put('/api/editActivity', { status: 500, body: { error: 'Failed to edit activity' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-name'), { target: { value: 'Updated Running' } });
    fireEvent.click(screen.getByTestId('submit-edit'));
  });

  expect(fetchMock.called('/api/editActivity')).toBeTruthy();
  expect(screen.getByText('Failed to edit activity')).toBeInTheDocument();
}, 10000);

test('logs water intake successfully and displays intake in the list', async () => {
  fetchMock.post('/api/log-water-intake', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter water intake'), { target: { value: '500' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Water')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Water logged successfully!')).toBeInTheDocument();
}, 10000);

test('fails to log water intake and displays an error message', async () => {
  fetchMock.post('/api/log-water-intake', { status: 400, body: { error: 'Invalid intake' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter water intake'), { target: { value: '-100' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Water')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log water intake.')).toBeInTheDocument();
}, 10000);
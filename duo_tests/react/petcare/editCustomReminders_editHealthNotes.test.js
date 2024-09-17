import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editCustomReminders_editHealthNotes';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should update an existing custom reminder successfully', async () => {
  fetchMock.put('/api/edit-custom-reminder', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/New Custom Event/i), { target: { value: 'Training session' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Update Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Reminder updated successfully/i)).toBeInTheDocument();
}, 10000);

test('should fail to update an existing custom reminder', async () => {
  fetchMock.put('/api/edit-custom-reminder', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/New Custom Event/i), { target: { value: 'Training session' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Update Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Failed to update reminder/i)).toBeInTheDocument();
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
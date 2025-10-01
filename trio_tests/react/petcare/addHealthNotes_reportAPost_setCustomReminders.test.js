import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addHealthNotes_reportAPost_setCustomReminders';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Add health notes successfully', async () => {
  fetchMock.post('/api/health-notes', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('notes-input'), { target: { value: 'Healthy!' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-notes').length).toBe(1);
  expect(screen.getByText('Health notes added')).toBeInTheDocument();
}, 10000);

test('Fail to add health notes with error', async () => {
  fetchMock.post('/api/health-notes', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('notes-input'), { target: { value: '' } }); }); // Failure case: Empty input
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-notes').length).toBe(1);
  expect(screen.getByText('Failed to add health notes')).toBeInTheDocument(); // Error message
}, 10000);

test('Successfully reports an inappropriate post', async () => {
  fetchMock.post('/api/community/report', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('report-button', { name: /report/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post reported successfully')).toBeInTheDocument();
}, 10000);

test('Fails to report an inappropriate post', async () => {
  fetchMock.post('/api/community/report', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('report-button', { name: /report/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to report post')).toBeInTheDocument();
}, 10000);

test('should set a new custom reminder successfully', async () => {
  fetchMock.post('/api/set-custom-reminder', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Custom Event/i), { target: { value: 'Birthday' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Set Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Reminder set successfully/i)).toBeInTheDocument();
}, 10000);

test('should fail to set a new custom reminder', async () => {
  fetchMock.post('/api/set-custom-reminder', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Custom Event/i), { target: { value: 'Birthday' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Set Reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Failed to set reminder/i)).toBeInTheDocument();
}, 10000);

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteHealthNotes_viewSymptomsLog';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('View symptoms log successfully', async () => {
  fetchMock.get('/api/symptoms', [{ id: 1, description: 'Coughing' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/symptoms').length).toBe(1);
  expect(screen.getByText('Coughing')).toBeInTheDocument();
}, 10000);

test('Fail to view symptoms log with error', async () => {
  fetchMock.get('/api/symptoms', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/symptoms').length).toBe(1);
  expect(screen.getByText('Failed to fetch symptoms log')).toBeInTheDocument(); // Error message
}, 10000);
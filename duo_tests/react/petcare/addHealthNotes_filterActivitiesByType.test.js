import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addHealthNotes_filterActivitiesByType';

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

test('Filters activities by type successfully.', async () => {
  fetchMock.get('/activities?type=walk', [{ type: 'walk', description: 'Morning walk' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('filter-input'), { target: { value: 'walk' } }); });

  expect(fetchMock.calls('/activities?type=walk').length).toBe(1);
  expect(screen.getByText('Morning walk')).toBeInTheDocument();
}, 10000);

test('Fails to filter activities by type with error message.', async () => {
  fetchMock.get('/activities?type=walk', { status: 500, body: { message: 'Failed to filter activities' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('filter-input'), { target: { value: 'walk' } }); });

  expect(fetchMock.calls('/activities?type=walk').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);
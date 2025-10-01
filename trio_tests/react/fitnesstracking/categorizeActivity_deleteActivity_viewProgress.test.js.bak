import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './categorizeActivity_deleteActivity_viewProgress';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('User can categorize a fitness activity successfully.', async () => {
  fetchMock.post('/api/categorizeActivity', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><FitnessApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-category'), { target: { value: 'Cycling' } });
    fireEvent.click(screen.getByTestId('submit-category'));
  });

  expect(fetchMock.called('/api/categorizeActivity')).toBeTruthy();
  expect(screen.getByText('Category set successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when categorizing a fitness activity fails.', async () => {
  fetchMock.post('/api/categorizeActivity', { status: 500, body: { error: 'Failed to set category' } });

  await act(async () => {
    render(<MemoryRouter><FitnessApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-category'), { target: { value: 'Cycling' } });
    fireEvent.click(screen.getByTestId('submit-category'));
  });

  expect(fetchMock.called('/api/categorizeActivity')).toBeTruthy();
  expect(screen.getByText('Failed to set category')).toBeInTheDocument();
}, 10000);

test('User can delete a fitness activity successfully.', async () => {
  fetchMock.delete('/api/deleteActivity', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><FitnessApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-activity'));
  });

  expect(fetchMock.called('/api/deleteActivity')).toBeTruthy();
  expect(screen.getByText('Activity deleted successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when deleting a fitness activity fails.', async () => {
  fetchMock.delete('/api/deleteActivity', { status: 500, body: { error: 'Failed to delete activity' } });

  await act(async () => {
    render(<MemoryRouter><FitnessApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-activity'));
  });

  expect(fetchMock.called('/api/deleteActivity')).toBeTruthy();
  expect(screen.getByText('Failed to delete activity')).toBeInTheDocument();
}, 10000);

test('should successfully view a graphical progress representation', async () => {
  fetchMock.get('/api/progress/graph', { status: 200, body: {} });

  await act(async () => {
    render(<MemoryRouter><ViewProgressGraph /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/progress chart/i)).toBeInTheDocument();
}, 10000);

test('should show error message when viewing a graphical progress representation fails', async () => {
  fetchMock.get('/api/progress/graph', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><ViewProgressGraph /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to load progress/i)).toBeInTheDocument();
}, 10000);

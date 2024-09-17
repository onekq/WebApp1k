import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './logDailyActivity_shareUpdates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Logs a daily activity successfully.', async () => {
  fetchMock.post('/activities', { message: 'Activity logged' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('activity-input'), { target: { value: 'Walk the dog' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/activities').length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Fails to log a daily activity with error message.', async () => {
  fetchMock.post('/activities', { status: 500, body: { message: 'Failed to log activity' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('activity-input'), { target: { value: 'Walk the dog' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/activities').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Successfully shares updates with the community', async () => {
  fetchMock.post('/api/community/share', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('update-input'), { target: { value: 'New update' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Update shared successfully')).toBeInTheDocument();
}, 10000);

test('Fails to share updates without input', async () => {
  fetchMock.post('/api/community/share', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to share update')).toBeInTheDocument();
}, 10000);
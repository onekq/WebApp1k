import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ActivityLogger from './uerActivityLogging';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully logs user activities.', async () => {
  fetchMock.post('/api/log', {
    status: 200, body: { message: 'Activity logged' }
  });

  await act(async () => {
    render(<MemoryRouter><ActivityLogger /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Like'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Activity logged')).toBeInTheDocument();
}, 10000);

test('Shows error message when logging user activities fails.', async () => {
  fetchMock.post('/api/log', {
    status: 500, body: { message: 'Failed to log activity' }
  });

  await act(async () => {
    render(<MemoryRouter><ActivityLogger /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Like'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log activity')).toBeInTheDocument();
}, 10000);


import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contentFiltering_notificationForPostPins_uerActivityLogging';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Filters posts by hashtags successfully.', async () => {
  fetchMock.post('/api/filter', {
    status: 200, body: [{ id: 1, content: 'Hashtag post' }]
  });

  await act(async () => {
    render(<MemoryRouter><FilterComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('#Hashtag'), { target: { value: 'test' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Hashtag post')).toBeInTheDocument();
}, 10000);

test('Shows error message for invalid hashtag filter.', async () => {
  fetchMock.post('/api/filter', {
    status: 400, body: { message: 'Invalid hashtag' }
  });

  await act(async () => {
    render(<MemoryRouter><FilterComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('#Hashtag'), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid hashtag')).toBeInTheDocument();
}, 10000);

test('should send a notification when a post is pinned', async () => {
  fetchMock.post('/api/pin', { success: true });

  await act(async () => { render(<MemoryRouter><Post /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pin-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a post pin', async () => {
  fetchMock.post('/api/pin', 500);

  await act(async () => { render(<MemoryRouter><Post /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pin-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

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

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './averageRatingCalculation_interactiveQuizTypes_forumReplyNotification_liveSessionScheduling';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Average rating is calculated correctly for a course. (from averageRatingCalculation_interactiveQuizTypes)', async () => {
  fetchMock.get('/api/courses/ratings', { average: 4.5 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  
  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/average rating/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when rating calculation fails. (from averageRatingCalculation_interactiveQuizTypes)', async () => {
  fetchMock.get('/api/courses/ratings', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  
  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to calculate average rating/i)).toBeInTheDocument();
}, 10000);

test('Success: multiple choice quiz functions correctly (from averageRatingCalculation_interactiveQuizTypes)', async () => {
  fetchMock.get('/api/multiple-choice-quiz', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('start-multiple-choice-quiz')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Multiple choice quiz loaded')).toBeInTheDocument();
}, 10000);

test('Failure: multiple choice quiz fails to load (from averageRatingCalculation_interactiveQuizTypes)', async () => {
  fetchMock.get('/api/multiple-choice-quiz', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('start-multiple-choice-quiz')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error loading multiple choice quiz')).toBeInTheDocument();
}, 10000);

test('Successfully sends a forum reply notification (from forumReplyNotification_liveSessionScheduling)', async () => {
  fetchMock.post('/forum/reply-notifications', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Reply')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Notification sent')).toBeInTheDocument();
}, 10000);

test('Fails to send a forum reply notification (from forumReplyNotification_liveSessionScheduling)', async () => {
  fetchMock.post('/forum/reply-notifications', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Reply')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Notification failed')).toBeInTheDocument();
}, 10000);

test('Successfully schedules and notifies for live session (from forumReplyNotification_liveSessionScheduling)', async () => {
  fetchMock.post('/live-sessions/schedule', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Schedule')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Session scheduled')).toBeInTheDocument();
}, 10000);

test('Fails to schedule and notify for live session (from forumReplyNotification_liveSessionScheduling)', async () => {
  fetchMock.post('/live-sessions/schedule', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Schedule')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Scheduling failed')).toBeInTheDocument();
}, 10000);


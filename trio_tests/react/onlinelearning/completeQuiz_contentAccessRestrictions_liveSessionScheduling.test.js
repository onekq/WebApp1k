import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './completeQuiz_contentAccessRestrictions_liveSessionScheduling';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Success: quiz completes and submits', async () => {
  fetchMock.post('/api/quiz', 200);

  await act(async () => { render(<MemoryRouter><CompleteQuizComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('quiz-answer'), { target: { value: 'answer' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Quiz submitted successfully')).toBeInTheDocument();
}, 10000);

test('Failure: quiz submission fails', async () => {
  fetchMock.post('/api/quiz', 500);

  await act(async () => { render(<MemoryRouter><CompleteQuizComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('quiz-answer'), { target: { value: 'answer' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Quiz submission failed')).toBeInTheDocument();
}, 10000);

test('Content Access Restrictions success: should display restricted content.', async () => {
  fetchMock.get('/api/courses/1/content', { id: 1, title: 'Protected Content' });

  await act(async () => { render(<MemoryRouter><ContentAccessRestrictions courseId={1} permission="admin" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Protected Content')).toBeInTheDocument();
}, 10000);

test('Content Access Restrictions failure: should display an error message on unauthorized access.', async () => {
  fetchMock.get('/api/courses/1/content', 403);

  await act(async () => { render(<MemoryRouter><ContentAccessRestrictions courseId={1} permission="guest" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Access restricted.')).toBeInTheDocument();
}, 10000);

test('Successfully schedules and notifies for live session', async () => {
  fetchMock.post('/live-sessions/schedule', { status: 200 });

  await act(async () => { render(<MemoryRouter><LiveSessionScheduling /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Schedule')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Session scheduled')).toBeInTheDocument();
}, 10000);

test('Fails to schedule and notify for live session', async () => {
  fetchMock.post('/live-sessions/schedule', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><LiveSessionScheduling /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Schedule')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Scheduling failed')).toBeInTheDocument();
}, 10000);

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './courseSearch_quizScoring_automatedReminders_peerReviewAssignments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Course Search success: should display search results. (from courseSearch_quizScoring)', async () => {
  fetchMock.get('/api/courses?search=React', [{ id: 1, title: 'React Course' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search for courses...'), { target: { value: 'React' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('React Course')).toBeInTheDocument();
}, 10000);

test('Course Search failure: should display an error message if no results found. (from courseSearch_quizScoring)', async () => {
  fetchMock.get('/api/courses?search=Unknown', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search for courses...'), { target: { value: 'Unknown' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No courses found.')).toBeInTheDocument();
}, 10000);

test('Quiz scoring is calculated correctly. (from courseSearch_quizScoring)', async () => {
  fetchMock.post('/api/quiz/score', { score: 85 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/answer/i), { target: { value: 'correct answer' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/your score/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when quiz scoring fails. (from courseSearch_quizScoring)', async () => {
  fetchMock.post('/api/quiz/score', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/answer/i), { target: { value: 'wrong answer' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/error/i)).toBeInTheDocument();
}, 10000);

test('Successfully sends automated reminders for deadlines (from automatedReminders_peerReviewAssignments)', async () => {
  fetchMock.post('/reminders', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Send Reminders')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Reminders sent')).toBeInTheDocument();
}, 10000);

test('Fails to send automated reminders for deadlines (from automatedReminders_peerReviewAssignments)', async () => {
  fetchMock.post('/reminders', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Send Reminders')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Reminders failed')).toBeInTheDocument();
}, 10000);

test('Success: peer review assignment submitted (from automatedReminders_peerReviewAssignments)', async () => {
  fetchMock.post('/api/peer-review', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('peer-review-text'), { target: { value: 'review' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Peer review submitted')).toBeInTheDocument();
}, 10000);

test('Failure: peer review assignment submission fails (from automatedReminders_peerReviewAssignments)', async () => {
  fetchMock.post('/api/peer-review', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('peer-review-text'), { target: { value: 'review' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Peer review submission failed')).toBeInTheDocument();
}, 10000);


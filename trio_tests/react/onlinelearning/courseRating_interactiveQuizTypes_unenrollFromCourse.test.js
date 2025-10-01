import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './courseRating_interactiveQuizTypes_unenrollFromCourse';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Users can rate and review courses.', async () => {
  fetchMock.post('/api/courses/rate', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/rating/i), { target: { value: 5 } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/review/i), { target: { value: 'Great course!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit review/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/review submitted/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when submission fails.', async () => {
  fetchMock.post('/api/courses/rate', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/rating/i), { target: { value: 3 } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/review/i), { target: { value: 'Okay course.' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit review/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to submit review/i)).toBeInTheDocument();
}, 10000);

test('Success: multiple choice quiz functions correctly', async () => {
  fetchMock.get('/api/multiple-choice-quiz', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('start-multiple-choice-quiz')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Multiple choice quiz loaded')).toBeInTheDocument();
}, 10000);

test('Failure: multiple choice quiz fails to load', async () => {
  fetchMock.get('/api/multiple-choice-quiz', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('start-multiple-choice-quiz')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error loading multiple choice quiz')).toBeInTheDocument();
}, 10000);

test('Users can successfully unenroll from a course.', async () => {
  fetchMock.delete('/api/unenroll/101', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Unenroll from Course/i)); });

  expect(fetchMock.calls('/api/unenroll/101').length).toEqual(1);
  expect(screen.getByText(/Unenrolled successfully/i)).toBeInTheDocument();
}, 10000);

test('Users cannot unenroll from a course if the server returns an error.', async () => {
  fetchMock.delete('/api/unenroll/101', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Unenroll from Course/i)); });

  expect(fetchMock.calls('/api/unenroll/101').length).toEqual(1);
  expect(screen.getByText(/Failed to unenroll/i)).toBeInTheDocument();
}, 10000);

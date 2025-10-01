import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './quizRetakeLogic_sortCourses_userProgressExport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Success: quiz retake works properly', async () => {
  fetchMock.post('/api/quiz-retake', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('retake-quiz-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Quiz retake successful')).toBeInTheDocument();
}, 10000);

test('Failure: quiz retake fails', async () => {
  fetchMock.post('/api/quiz-retake', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('retake-quiz-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Quiz retake failed')).toBeInTheDocument();
}, 10000);

test('Sort Courses success: should display sorted courses.', async () => {
  fetchMock.get('/api/courses?sort=popularity', [{ id: 1, title: 'Popular Course' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('course-sort'), { target: { value: 'popularity' } }); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Popular Course')).toBeInTheDocument();
}, 10000);

test('Sort Courses failure: should display an error message if no sorting results.', async () => {
  fetchMock.get('/api/courses?sort=unknown', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('course-sort'), { target: { value: 'unknown' } }); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No courses found for this sort.')).toBeInTheDocument();
}, 10000);

test('Successfully exports user progress data', async () => {
  fetchMock.get('/user-progress/export', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Export Progress')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Export successful')).toBeInTheDocument();
}, 10000);

test('Fails to export user progress data', async () => {
  fetchMock.get('/user-progress/export', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Export Progress')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Export failed')).toBeInTheDocument();
}, 10000);

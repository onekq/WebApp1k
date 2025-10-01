import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './badgeAwarding_courseMaterialUpload_quizScoring';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Badge is awarded for course achievements.', async () => {
  fetchMock.post('/api/course/awardBadge', { badgeId: 1 });

  await act(async () => { render(<MemoryRouter><CourseAchievement /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/achieve badge/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/badge awarded/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when badge awarding fails.', async () => {
  fetchMock.post('/api/course/awardBadge', 500);

  await act(async () => { render(<MemoryRouter><CourseAchievement /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/achieve badge/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to award badge/i)).toBeInTheDocument();
}, 10000);

test('Success: instructor uploads course material', async () => {
  fetchMock.post('/api/upload', 200);

  await act(async () => { render(<MemoryRouter><CourseMaterialUploadComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('upload-file'), { target: { files: ['file'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('upload-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Material uploaded successfully')).toBeInTheDocument();
}, 10000);

test('Failure: course material upload fails', async () => {
  fetchMock.post('/api/upload', 500);

  await act(async () => { render(<MemoryRouter><CourseMaterialUploadComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('upload-file'), { target: { files: ['file'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('upload-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Material upload failed')).toBeInTheDocument();
}, 10000);

test('Quiz scoring is calculated correctly.', async () => {
  fetchMock.post('/api/quiz/score', { score: 85 });

  await act(async () => { render(<MemoryRouter><Quiz /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/answer/i), { target: { value: 'correct answer' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/your score/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when quiz scoring fails.', async () => {
  fetchMock.post('/api/quiz/score', 500);

  await act(async () => { render(<MemoryRouter><Quiz /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/answer/i), { target: { value: 'wrong answer' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/error/i)).toBeInTheDocument();
}, 10000);

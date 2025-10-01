import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './badgeAwarding_contentDownload_courseScheduling';

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

test('Success: content downloaded successfully', async () => {
  fetchMock.get('/api/download', 200);

  await act(async () => { render(<MemoryRouter><ContentDownloadComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('download-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Content downloaded successfully')).toBeInTheDocument();
}, 10000);

test('Failure: content download fails', async () => {
  fetchMock.get('/api/download', 500);

  await act(async () => { render(<MemoryRouter><ContentDownloadComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('download-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Content download failed')).toBeInTheDocument();
}, 10000);

test('Course Scheduling success: should display scheduled courses.', async () => {
  fetchMock.post('/api/schedule-course', { success: true });

  await act(async () => { render(<MemoryRouter><CourseScheduling /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Course ID'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Schedule')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Course successfully scheduled.')).toBeInTheDocument();
}, 10000);

test('Course Scheduling failure: should display an error message on schedule failure.', async () => {
  fetchMock.post('/api/schedule-course', 400);

  await act(async () => { render(<MemoryRouter><CourseScheduling /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Course ID'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Schedule')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to schedule course.')).toBeInTheDocument();
}, 10000);

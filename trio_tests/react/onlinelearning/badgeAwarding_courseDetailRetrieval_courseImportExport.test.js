import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './badgeAwarding_courseDetailRetrieval_courseImportExport';

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

test('Course Detail Retrieval success: should display course details.', async () => {
  fetchMock.get('/api/courses/1', { id: 1, title: 'React Course', details: 'Detailed info' });

  await act(async () => { render(<MemoryRouter><CourseDetail courseId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Detailed info')).toBeInTheDocument();
}, 10000);

test('Course Detail Retrieval failure: should display an error message on failed detail retrieval.', async () => {
  fetchMock.get('/api/courses/1', 404);

  await act(async () => { render(<MemoryRouter><CourseDetail courseId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Course details cannot be retrieved.')).toBeInTheDocument();
}, 10000);

test('Course Import/Export success: should display success message on course import.', async () => {
  fetchMock.post('/api/import-course', { success: true });

  await act(async () => { render(<MemoryRouter><CourseImportExport /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('file-upload'), { target: { files: [new File([''], 'course.json')] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Import Course')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Course successfully imported.')).toBeInTheDocument();
}, 10000);

test('Course Import/Export failure: should display an error message on course import failure.', async () => {
  fetchMock.post('/api/import-course', 400);

  await act(async () => { render(<MemoryRouter><CourseImportExport /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('file-upload'), { target: { files: [new File([''], 'course.json')] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Import Course')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to import course.')).toBeInTheDocument();
}, 10000);

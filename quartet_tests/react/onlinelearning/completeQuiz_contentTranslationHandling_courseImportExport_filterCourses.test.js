import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './completeQuiz_contentTranslationHandling_courseImportExport_filterCourses';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: quiz completes and submits (from completeQuiz_contentTranslationHandling)', async () => {
  fetchMock.post('/api/quiz', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('quiz-answer'), { target: { value: 'answer' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Quiz submitted successfully')).toBeInTheDocument();
}, 10000);

test('Failure: quiz submission fails (from completeQuiz_contentTranslationHandling)', async () => {
  fetchMock.post('/api/quiz', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('quiz-answer'), { target: { value: 'answer' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Quiz submission failed')).toBeInTheDocument();
}, 10000);

test('Content Translation Handling success: should display translated content. (from completeQuiz_contentTranslationHandling)', async () => {
  fetchMock.get('/api/courses/1?lang=es', { id: 1, title: 'Curso de Reacto', details: 'Informaci�n detallada' });

  await act(async () => { render(<MemoryRouter><App courseId={1} language="es" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Curso de Reacto')).toBeInTheDocument();
}, 10000);

test('Content Translation Handling failure: should display an error message on translation failure. (from completeQuiz_contentTranslationHandling)', async () => {
  fetchMock.get('/api/courses/1?lang=es', 404);

  await act(async () => { render(<MemoryRouter><App courseId={1} language="es" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Content cannot be translated.')).toBeInTheDocument();
}, 10000);

test('Course Import/Export success: should display success message on course import. (from courseImportExport_filterCourses)', async () => {
  fetchMock.post('/api/import-course', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('file-upload'), { target: { files: [new File([''], 'course.json')] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Import Course')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Course successfully imported.')).toBeInTheDocument();
}, 10000);

test('Course Import/Export failure: should display an error message on course import failure. (from courseImportExport_filterCourses)', async () => {
  fetchMock.post('/api/import-course', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('file-upload'), { target: { files: [new File([''], 'course.json')] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Import Course')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to import course.')).toBeInTheDocument();
}, 10000);

test('Filter Courses success: should display filtered courses. (from courseImportExport_filterCourses)', async () => {
  fetchMock.get('/api/courses?filter=beginner', [{ id: 1, title: 'Beginner Course' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('course-filter'), { target: { value: 'beginner' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Filters')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Beginner Course')).toBeInTheDocument();
}, 10000);

test('Filter Courses failure: should display an error message if no filter results. (from courseImportExport_filterCourses)', async () => {
  fetchMock.get('/api/courses?filter=advanced', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('course-filter'), { target: { value: 'advanced' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Filters')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No courses found for this filter.')).toBeInTheDocument();
}, 10000);

